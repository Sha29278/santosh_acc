import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// ---------- helpers ----------

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function filePath(filename: string): string {
  ensureDir(DATA_DIR);
  return path.join(DATA_DIR, filename);
}

function isVercel(): boolean {
  return !!process.env.VERCEL;
}

// ---------- KV abstraction ----------

let kvClient: typeof import("@vercel/kv").kv | null = null;

async function getKv() {
  if (kvClient) return kvClient;
  if (!isVercel()) return null;
  if (!process.env.KV_REST_API_URL) return null;
  try {
    const mod = await import("@vercel/kv");
    kvClient = mod.kv;
    return kvClient;
  } catch {
    return null;
  }
}

// ---------- public API ----------

/**
 * Read JSON data from KV (on Vercel) or the local filesystem.
 * On Vercel, if KV has no data for this key, we seed it from the committed
 * JSON file so the first visitor always sees content.
 */
export async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  const kvKey = `data:${filename.replace(".json", "")}`;

  // Try Vercel KV first
  const kv = await getKv();
  if (kv) {
    try {
      const cached = await kv.get<T>(kvKey);
      if (cached !== null && cached !== undefined) return cached;

      // KV empty → seed from committed file so the site has content
      const fp = filePath(filename);
      if (fs.existsSync(fp)) {
        const fileData = JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
        await kv.set(kvKey, fileData);
        return fileData;
      }
    } catch {
      // KV failure → fall through to filesystem
    }
  }

  // Local dev or KV failure → filesystem
  try {
    const fp = filePath(filename);
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write JSON data to KV (on Vercel) and the local filesystem.
 * On Vercel this makes changes persist across serverless restarts.
 */
export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const kvKey = `data:${filename.replace(".json", "")}`;

  // Write to KV (persists on Vercel)
  const kv = await getKv();
  if (kv) {
    try {
      await kv.set(kvKey, data);
    } catch {
      // KV write failure — continue to filesystem
    }
  }

  // Also write to filesystem (local dev + backup)
  ensureDir(DATA_DIR);
  fs.writeFileSync(filePath(filename), JSON.stringify(data, null, 2), "utf-8");
}

// ---------- Upload helpers (keep filesystem — not suitable for KV) ----------

export function saveBase64Image(base64: string, filename: string): string {
  ensureDir(UPLOADS_DIR);
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(data, "base64");
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fullPath = path.join(UPLOADS_DIR, safeName);
  fs.writeFileSync(fullPath, buffer);
  return `/uploads/${safeName}`;
}

export function deleteFile(relativePath: string): void {
  const fullPath = path.join(process.cwd(), "public", relativePath);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
}

export function listUploads(): string[] {
  ensureDir(UPLOADS_DIR);
  return fs.readdirSync(UPLOADS_DIR).map((f) => `/uploads/${f}`);
}
