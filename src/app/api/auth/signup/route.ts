import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/admin/storage";

interface AdminConfig {
  adminUsername: string;
  adminPassword: string;
  adminEmail?: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const config = readJSON<AdminConfig>("site-config.json", {
      adminUsername: "admin",
      adminPassword: "admin@123",
      siteName: "TaxEase",
      siteDescription: "Your Trusted GST & Taxation Partner",
      contactEmail: "info@taxease.com",
      contactPhone: "+91 99999 99999",
      address: "123, Business Hub, Andheri East, Mumbai - 400093",
    });

    // Store the new admin credentials
    config.adminUsername = username;
    config.adminPassword = password;
    config.adminEmail = email;
    writeJSON("site-config.json", config);

    // Auto-login after signup
    const response = NextResponse.json({
      success: true,
      message: "Account created successfully!",
    });
    response.cookies.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
