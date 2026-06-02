import { NextResponse } from "next/server";
import { readJSON } from "@/lib/admin/storage";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const config = readJSON("site-config.json", {
      adminUsername: "admin",
      adminPassword: "admin@123",
    });

    if (
      username === config.adminUsername &&
      password === config.adminPassword
    ) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      return response;
    }

    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ authenticated: false });
}
