import fs from "fs";
import path from "path";
import { commitTextFile, commitBinaryFile, deleteRepoFile, isGitDeployEnabled } from "./git-deploy";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Detect Vercel serverless environment (filesystem is read-only except /tmp)
const IS_VERCEL = !!process.env.VERCEL;

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

// ---------- JSON data (filesystem + git deploy) ----------

/**
 * Read JSON data from the local filesystem (works on Vercel since data/ is baked into build).
 * Falls back to default if file doesn't exist or can't be read.
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
 * Write JSON data to filesystem (for local dev) AND commit to GitHub.
 * On Vercel, the filesystem write is skipped (read-only) — only the GitHub commit matters.
 * Vercel auto-deploys after the commit, and the next build picks up the new file.
 */
export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  const content = JSON.stringify(data, null, 2);

  // Write to filesystem (works locally, silently fails on Vercel)
  safeWriteFileSync(filePath(filename), content);

  // Commit to GitHub (triggers Vercel redeploy)
  if (isGitDeployEnabled()) {
    await commitTextFile(
      `data/${filename}`,
      content,
      `admin: update ${filename.replace(".json", "")}`,
    );
  }
}

// ---------- File upload (filesystem + git deploy) ----------

/**
 * Upload a file to filesystem (local dev) AND commit to GitHub.
 * On Vercel, only the GitHub commit happens — images are served via /api/uploads/[file] route.
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
 * List all uploaded files — reads from filesystem (works on Vercel since uploads/ is baked into build).
 * New uploads made after deployment won't appear until next build, but that's handled by GitHub commit.
 */
export async function listUploads(): Promise<string[]> {
  try {
    ensureDir(UPLOADS_DIR);
    return fs.readdirSync(UPLOADS_DIR).map((f) => `/uploads/${f}`);
  } catch {
    return [];
  }
}
