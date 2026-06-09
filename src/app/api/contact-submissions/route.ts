import { NextResponse } from "next/server";
import { readJSON } from "@/lib/admin/storage";

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

export async function GET() {
  try {
    const submissions = await readJSON<Submission[]>("contact-submissions.json", []);
    // Sort newest first
    submissions.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("[contact-submissions] Error reading submissions:", error);
    return NextResponse.json([], { status: 500 });
  }
}
