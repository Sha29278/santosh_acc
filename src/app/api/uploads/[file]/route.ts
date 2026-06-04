import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com";

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

/**
 * Fetch a file from GitHub repo (for images uploaded after the last deployment).
 * Falls back gracefully if env vars not configured.
 */
async function fetchFromGitHub(filename: string): Promise<Buffer | null> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;

  try {
    const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/public/uploads/${filename}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json() as { content: string; encoding: string };
    if (data.encoding === "base64" && data.content) {
      return Buffer.from(data.content, "base64");
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;

  // Sanitize the filename to prevent path traversal
  const sanitized = file.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!sanitized) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  const ext = path.extname(sanitized).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

  // 1. Try local filesystem paths (works in local dev, and for files baked into the build)
  const localPaths = [
    path.join(process.cwd(), "public", "uploads", sanitized),
    path.join("/tmp", "uploads", sanitized),
  ];

  for (const fp of localPaths) {
    try {
      if (fs.existsSync(fp)) {
        const buffer = fs.readFileSync(fp);
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // continue to next path
    }
  }

  // 2. Try GitHub API (for files uploaded after the last build)
  const githubBuffer = await fetchFromGitHub(sanitized);
  if (githubBuffer) {
    return new NextResponse(new Uint8Array(githubBuffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
