import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadFile, deleteFileByUrl, listUploads, saveBase64Image } from "@/lib/admin/storage";

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const files = await listUploads();
  return NextResponse.json(files);
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    // Handle multipart form data (file upload)
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const oldUrl = formData.get("oldUrl") as string | null;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      const url = await uploadFile(file, oldUrl || undefined);
      return NextResponse.json({ url }, { status: 201 });
    }

    // Handle base64 upload
    const { base64, name, oldUrl } = await request.json();
    const url = await saveBase64Image(base64, name || `image-${Date.now()}.png`);

    // Delete old file if replacing
    if (oldUrl) {
      await deleteFileByUrl(oldUrl);
    }

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { url } = await request.json();
  if (url) {
    await deleteFileByUrl(url);
  }
  return NextResponse.json({ success: true });
}
