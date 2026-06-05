import fs from "fs";
import path from "path";
import { commitTextFile, commitBinaryFile, deleteRepoFile, isGitDeployEnabled } from "./git-deploy";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// ---------- Data consistency strategy ----------
//
// readJSON  → Always reads from the deployed filesystem (consistent
//              across all Vercel instances). No in-memory cache.
// writeJSON → Writes to filesystem (local) + commits to GitHub.
//             The admin panel's client-cache.ts handles the admin's
//             own immediate read-after-write via localStorage.
//
// After the git commit, Vercel auto-deploys (~30-60s) and all
// instances serve the same updated data — no yo-yo effect.

// ---------- helpers ----------

function ensureDir(dir: string) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch {
    // Vercel: can't create dirs, that's OK
  }
}

function filePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

/** Safe filesystem write — returns false on Vercel (read-only) or errors */
function safeWriteFileSync(filepath: string, data: string | Buffer): boolean {
  try {
    ensureDir(path.dirname(filepath));
    fs.writeFileSync(filepath, data);
    return true;
  } catch {
    // On Vercel, filesystem is read-only — this is expected
    return false;
  }
}

function safeUnlinkSync(filepath: string): boolean {
  try {
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return true;
  } catch {
    return false;
  }
}

// ---------- JSON data (filesystem + cache + git deploy) ----------

/**
 * Read JSON data — reads directly from the deployed filesystem.
 * Skips the in-memory cache entirely to ensure consistent data
 * across all Vercel serverless instances (no yo-yo effect).
 * Falls back to default if file doesn't exist.
 */
export async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  try {
    const fp = filePath(filename);
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write JSON data to cache + filesystem (local dev) + commit to GitHub.
 * Cache ensures subsequent reads return the latest data immediately,
 * even on Vercel where filesystem is read-only and deploy takes ~60s.
 */
export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  // 1. Write to filesystem (works locally, silently fails on Vercel)
  safeWriteFileSync(filePath(filename), content);

  // 2. Commit to GitHub (triggers Vercel redeploy for all instances)
  if (isGitDeployEnabled()) {
    const committed = await commitTextFile(
      `data/${filename}`,
      content,
      `admin: update ${filename.replace(".json", "")}`,
    );
    if (!committed) {
      console.error(`[git-deploy] Failed to commit ${filename} to GitHub — changes may not persist`);
    }
  }
}

// ---------- File upload (filesystem + git deploy) ----------

/**
 * Upload a file to filesystem (local dev) AND commit to GitHub.
 * If oldUrl is provided, the old file is deleted after successful upload.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  file: File,
  oldUrl?: string,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  // Write to local filesystem (works locally, silently fails on Vercel)
  const localPath = path.join(UPLOADS_DIR, filename);
  safeWriteFileSync(localPath, buffer);

  // Commit to GitHub (this is the real persistence)
  if (isGitDeployEnabled()) {
    await commitBinaryFile(
      `public/uploads/${filename}`,
      buffer,
      `admin: upload ${filename}`,
    );
  }

  // Delete old file AFTER successful upload
  if (oldUrl) {
    await deleteFileByUrl(oldUrl);
  }

  return `/uploads/${filename}`;
}

/**
 * Upload a base64-encoded image to filesystem + git.
 */
export async function saveBase64Image(
  base64: string,
  filename: string,
): Promise<string> {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(data, "base64");

  // Write to local filesystem (works locally, silently fails on Vercel)
  safeWriteFileSync(path.join(UPLOADS_DIR, safeName), buffer);

  // Commit to GitHub
  if (isGitDeployEnabled()) {
    await commitBinaryFile(
      `public/uploads/${safeName}`,
      buffer,
      `admin: upload ${safeName}`,
    );
  }

  return `/uploads/${safeName}`;
}

/**
 * Delete a file by URL — removes from filesystem AND GitHub.
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  // Never delete default placeholder images
  if (url.includes("/default-") || url.includes("default-blog")) return;

  if (url.startsWith("/uploads/")) {
    const filename = url.replace("/uploads/", "");

    // Delete from filesystem (works locally, silently fails on Vercel)
    safeUnlinkSync(path.join(process.cwd(), "public", url));

    // Delete from GitHub
    if (isGitDeployEnabled()) {
      await deleteRepoFile(
        `public/uploads/${filename}`,
        `admin: delete ${filename}`,
      );
    }
  }
}

/**
 * List all uploaded files — reads from filesystem.
 */
export async function listUploads(): Promise<string[]> {
  try {
    ensureDir(UPLOADS_DIR);
    return fs.readdirSync(UPLOADS_DIR).map((f) => `/uploads/${f}`);
  } catch {
    return [];
  }
}
