import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/admin/storage";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
}

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 },
      );
    }

    // Create submission record
    const submission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email,
      phone,
      service: service || "Not specified",
      message: message || "",
      timestamp: new Date().toISOString(),
    };

    // Read existing submissions and append
    const existing = await readJSON<Submission[]>("contact-submissions.json", []);
    existing.push(submission);
    const saved = await writeJSON("contact-submissions.json", existing);

    if (!saved) {
      console.error("[contact] Failed to save submission to GitHub");
    }

    return NextResponse.json({
      success: true,
      message: "Your query has been received! We'll get back to you within 24 hours.",
      id: submission.id,
    });
  } catch (error) {
    console.error("[contact] Error saving submission:", error);
    return NextResponse.json(
      { error: "Failed to save your query. Please try again." },
      { status: 500 },
    );
  }
}
