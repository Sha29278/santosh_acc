import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJSON, writeJSON } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

import type { DueDateOverride } from "@/lib/generate-due-dates";

export type { DueDateOverride };

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

export async function GET() {
  const overrides = readJSON<DueDateOverride[]>("due-date-overrides.json", []);
  return NextResponse.json(overrides);
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected an array of overrides" }, { status: 400 });
  }
  writeJSON("due-date-overrides.json", body);
  return NextResponse.json({ success: true, count: body.length });
}
