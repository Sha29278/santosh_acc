import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJSON, writeJSON } from "@/lib/admin/storage";

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

const KEYS = ["services", "faqs", "tax-slabs", "due-dates"] as const;
type DataKey = (typeof KEYS)[number];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!KEYS.includes(key as DataKey)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  const data = readJSON(`${key}.json`, []);
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { key } = await params;
  if (!KEYS.includes(key as DataKey)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  const body = await request.json();
  writeJSON(`${key}.json`, body);
  return NextResponse.json({ success: true });
}
