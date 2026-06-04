import fs from "fs";
import path from "path";
import { commitTextFile, commitBinaryFile, deleteRepoFile, isGitDeployEnabled } from "./git-deploy";

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

// ---------- JSON data (filesystem + git deploy) ----------

/**
 * Read JSON data from the local filesystem.
 * On Vercel, this reads from the committed codebase (baked in at build time).
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
 * Write JSON data to the local filesystem AND commit to GitHub.
 * On Vercel, this triggers a redeploy with the new data.
 */
export async function writeJSON<T>(filename: string, data: T): Promise<void> {
  // Write to filesystem
  ensureDir(DATA_DIR);
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath(filename), content, "utf-8");

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
 * Upload a file to the local filesystem AND commit to GitHub.
 * If oldUrl is provided, the old file is deleted after successful upload.
 * Returns the public URL of the uploaded file.
 */
export async function uploadFile(
  file: File,
  oldUrl?: string,
): Promise<string> {
  ensureDir(UPLOADS_DIR);
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const localPath = path.join(UPLOADS_DIR, filename);

  // Write to local filesystem
  fs.writeFileSync(localPath, buffer);

  // Commit to GitHub
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

  ensureDir(UPLOADS_DIR);
  const fullPath = path.join(UPLOADS_DIR, safeName);
  fs.writeFileSync(fullPath, buffer);

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
    const fullPath = path.join(process.cwd(), "public", url);

    // Delete from filesystem
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

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
 * List all uploaded files from the local filesystem.
 */
export async function listUploads(): Promise<string[]> {
  ensureDir(UPLOADS_DIR);
  return fs.readdirSync(UPLOADS_DIR).map((f) => `/uploads/${f}`);
}
