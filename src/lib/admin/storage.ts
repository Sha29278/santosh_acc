import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function filePath(filename: string): string {
  ensureDir(DATA_DIR);
  return path.join(DATA_DIR, filename);
}

export function readJSON<T>(filename: string, fallback: T): T {
  try {
    const fp = filePath(filename);
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(filename: string, data: T): void {
  ensureDir(DATA_DIR);
  fs.writeFileSync(filePath(filename), JSON.stringify(data, null, 2), "utf-8");
}

export function saveBase64Image(base64: string, filename: string): string {
  ensureDir(UPLOADS_DIR);
  // Remove data:image/...;base64, prefix if present
  const data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(data, "base64");
  // Sanitize filename
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
