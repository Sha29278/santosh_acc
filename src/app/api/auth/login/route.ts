import { NextResponse } from "next/server";

// Static credentials that always work for admin sign-in
const STATIC_USERNAME = "santosh";
const STATIC_PASSWORD = "admin@123";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      (username === STATIC_USERNAME && password === STATIC_PASSWORD)
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
