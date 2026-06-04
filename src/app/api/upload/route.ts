import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveBase64Image, listUploads, deleteFile } from "@/lib/admin/storage";

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const files = listUploads();
  return NextResponse.json(files);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (file) {
      // Handle file upload
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { writeFileSync, existsSync, mkdirSync } = await import("fs");
      const path = await import("path");

      // On Vercel, public/ is read-only — write to /tmp/uploads/ instead
      // Served via a separate /api/uploads/[file] route or accessed directly
      const isVercel = !!process.env.VERCEL;
      const uploadsDir = isVercel
        ? path.join("/tmp", "uploads")
        : path.join(process.cwd(), "public", "uploads");

      if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });
      writeFileSync(path.join(uploadsDir, filename), buffer);

      // Return a URL the frontend can use
      const url = isVercel ? `/api/uploads/${filename}` : `/uploads/${filename}`;
      return NextResponse.json({ url }, { status: 201 });
    }

    // Handle base64 upload
    const { base64, name } = await request.json();
    const url = saveBase64Image(base64, name || `image-${Date.now()}.png`);
    return NextResponse.json({ url }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { url } = await request.json();
  deleteFile(url);
  return NextResponse.json({ success: true });
}
