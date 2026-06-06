import fs from "fs";
import path from "path";
import { commitTextFile, commitBinaryFile, deleteRepoFile, isGitDeployEnabled } from "./git-deploy";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// ---------- Data consistency strategy ----------
//
// readJSON  → Tries GitHub API Contents endpoint first (returns
//              latest committed data without CDN caching). Falls
//              back to the deployed filesystem, then defaults.
// writeJSON → Writes to filesystem (local) + commits to GitHub.
//             The admin panel's client-cache.ts handles the admin's
//             own immediate read-after-write via localStorage.
//
// Data is available immediately after the GitHub commit finishes,
// no need to wait for Vercel redeploy (~30-60s).

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

// ---------- JSON data (filesystem + GitHub raw + git deploy) ----------

/**
 * Read JSON data — tries GitHub raw URL first (always latest),
 * falls back to the deployed filesystem, then defaults.
 *
 * On Vercel the filesystem only has data from the last deploy.
 * GitHub raw gives us the latest committed data immediately
 * without waiting for a Vercel redeploy.
 */
export async function readJSON<T>(filename: string, fallback: T): Promise<T> {
  // 1. Try GitHub API first (always returns latest committed data, no CDN caching)
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (repo && token) {
    try {
      const url = `https://api.github.com/repos/${repo}/contents/data/${filename}`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "acctax-solutions",
        },
      });
      if (res.ok) {
        const body = await res.json();
        const jsonStr = Buffer.from(body.content, "base64").toString("utf-8");
        return JSON.parse(jsonStr) as T;
      }
      console.warn(`[storage] GitHub API returned ${res.status} for ${filename} — falling back to filesystem`);
    } catch (e) {
      console.warn(`[storage] GitHub API fetch failed for ${filename}: ${e} — falling back to filesystem`);
    }
  }

  // 2. Fall back to filesystem (works locally, may be stale on Vercel)
  try {
    const fp = filePath(filename);
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

/**
 * Write JSON data to filesystem (local dev) + commit to GitHub.
 * Returns true if the data was committed to GitHub, false otherwise.
 * On Vercel the filesystem write silently fails, so the GitHub
 * commit is the only way data persists.
 */
export async function writeJSON<T>(filename: string, data: T): Promise<boolean> {
  const content = JSON.stringify(data, null, 2);

  // 1. Write to filesystem (works locally, silently fails on Vercel)
  safeWriteFileSync(filePath(filename), content);

  // 2. Commit to GitHub (this is the real persistence on Vercel)
  if (isGitDeployEnabled()) {
    const committed = await commitTextFile(
      `data/${filename}`,
      content,
      `admin: update ${filename.replace(".json", "")}`,
    );
    if (!committed) {
      console.error(`[git-deploy] Failed to commit ${filename} to GitHub — changes may not persist`);
      return false;
    }
    return true;
  }

  // Local dev mode — filesystem write is enough
  return true;
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

  // Return /api/uploads/ URL so it goes through the API route
  // which has the GitHub API fallback (files not yet deployed)
  return `/api/uploads/${filename}`;
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

  // Return /api/uploads/ URL so it goes through the API route
  // which has the GitHub API fallback (files not yet deployed)
  return `/api/uploads/${safeName}`;
}

/**
 * Delete a file by URL — removes from filesystem AND GitHub.
 */
export async function deleteFileByUrl(url: string): Promise<void> {
  // Never delete default placeholder images
  if (url.includes("/default-") || url.includes("default-blog")) return;

  // Normalize URL: strip /api/ prefix if present (files are stored without /api/ on GitHub)
  const normalized = url.replace("/api/uploads/", "/uploads/");

  if (normalized.startsWith("/uploads/")) {
    const filename = normalized.replace("/uploads/", "");

    // Delete from filesystem (works locally, silently fails on Vercel)
    safeUnlinkSync(path.join(process.cwd(), "public", normalized));

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
 * List all uploaded files — tries GitHub API first (for files
 * uploaded after last deploy), falls back to filesystem.
 * Returns /api/uploads/ URLs so they go through the API route.
 */
export async function listUploads(): Promise<string[]> {
  // 1. Try GitHub API to list files in public/uploads/
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (repo && token) {
    try {
      const url = `https://api.github.com/repos/${repo}/contents/public/uploads`;
      const res = await fetch(url, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "acctax-solutions",
        },
      });
      if (res.ok) {
        const body = await res.json() as { name: string; type: string }[];
        if (Array.isArray(body)) {
          return body
            .filter((item) => item.type === "file")
            .map((item) => `/api/uploads/${item.name}`);
        }
      }
    } catch {
      // Fall through to filesystem
    }
  }

  // 2. Fall back to filesystem (local dev, or deployed files)
  try {
    ensureDir(UPLOADS_DIR);
    return fs.readdirSync(UPLOADS_DIR).map((f) => `/api/uploads/${f}`);
  } catch {
    return [];
  }
}
