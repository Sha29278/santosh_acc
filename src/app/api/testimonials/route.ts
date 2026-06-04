import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJSON, writeJSON } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

export async function GET() {
  const data = await readJSON<Record<string, unknown>[]>("testimonials.json", []);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    await writeJSON("testimonials.json", body);
    return NextResponse.json({ success: true, message: "Testimonials saved successfully!" });
  } catch {
    return NextResponse.json({ error: "Failed to save testimonials" }, { status: 500 });
  }
}
