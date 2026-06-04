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

// ---------- JSON data (KV + filesystem) ----------

/**
 * Read JSON data from KV (on Vercel) or the local filesystem.
 * On Vercel, if KV has no data for this key, seeds it from the committed
 * JSON file so the first visitor always sees content.
 */
export async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  const kvKey = `data:${filename.replace(".json", "")}`;

  const kv = await getKv();
  if (kv) {
    try {
      const cached = await kv.get<T>(kvKey);
      if (cached !== null && cached !== undefined) return cached;

      // KV empty → seed from committed file
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
 */
export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const kvKey = `data:${filename.replace(".json", "")}`;

  const kv = await getKv();
  if (kv) {
    try {
      await kv.set(kvKey, data);
    } catch {
      // KV write failure — continue to filesystem
    }
  }

  ensureDir(DATA_DIR);
  fs.writeFileSync(filePath(filename), JSON.stringify(data, null, 2), "utf-8");
}

// ---------- Blob upload helpers (Vercel Blob + local fallback) ----------

/**
 * Upload a file to Vercel Blob (production) or local filesystem (dev).
 * If `oldUrl` is provided and is a Blob URL, deletes the old file first.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  file: File,
  oldUrl?: string,
): Promise<string> {
  let url: string;

  // On Vercel with Blob token → use Vercel Blob
  if (isVercel() && process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const blob = await put(filename, file, { access: "public" });
    url = blob.url;
  } else {
    // Local dev or no Blob token → filesystem
    ensureDir(UPLOADS_DIR);
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
    url = `/uploads/${filename}`;
  }

  // Delete old file AFTER successful upload
  if (oldUrl) {
    await deleteFileByUrl(oldUrl);
  }

  return url;
}

/**
 * Upload a base64-encoded image to Vercel Blob or filesystem.
 */
export async function saveBase64Image(
  base64: string,
  filename: string,
): Promise<string> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(data, "base64");

  // On Vercel with Blob token → use Vercel Blob
  if (isVercel() && process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blobName = `${Date.now()}-${safeName}`;
    // Convert Buffer to ReadableStream for Blob
    const blob = await put(blobName, buffer, { access: "public" });
    return blob.url;
  }

  // Local dev → filesystem
  ensureDir(UPLOADS_DIR);
  fs.writeFileSync(path.join(UPLOADS_DIR, safeName), buffer);
  return `/uploads/${safeName}`;
}

/**
 * Delete a file by URL — works for both Vercel Blob URLs and local paths.
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  // Never delete default placeholder images
  if (url.includes("/default-") || url.includes("default-blog")) return;

  // Vercel Blob URL
  if (url.includes("blob.vercel-storage.com")) {
    try {
      const { del } = await import("@vercel/blob");
      await del(url);
    } catch {
      // Blob deletion failed — ignore
    }
    return;
  }

  // Local filesystem path
  if (url.startsWith("/uploads/")) {
    const fullPath = path.join(process.cwd(), "public", url);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

/**
 * List all uploaded files — from Vercel Blob or local filesystem.
 */
export async function listUploads(): Promise<string[]> {
  // Vercel Blob
  if (isVercel() && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list();
      return blobs.map((b) => b.url);
    } catch {
      return [];
    }
  }

  // Local filesystem
  ensureDir(UPLOADS_DIR);
  return fs.readdirSync(UPLOADS_DIR).map((f) => `/uploads/${f}`);
}
