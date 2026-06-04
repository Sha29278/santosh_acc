import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

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

  // Try /tmp/uploads first (Vercel runtime writes), then public/uploads (local dev)
  const paths = [
    path.join("/tmp", "uploads", sanitized),
    path.join(process.cwd(), "public", "uploads", sanitized),
  ];

  for (const fp of paths) {
    try {
      if (fs.existsSync(fp)) {
        const buffer = fs.readFileSync(fp);
        const ext = path.extname(sanitized).toLowerCase();
        const contentType: Record<string, string> = {
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".webp": "image/webp",
          ".svg": "image/svg+xml",
          ".ico": "image/x-icon",
        };
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": contentType[ext] || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {}
  }

  return NextResponse.json({ error: "File not found" }, { status: 404 });
}
