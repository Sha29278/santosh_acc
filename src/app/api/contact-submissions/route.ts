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

export async function GET() {
  try {
    const submissions = await readJSON<Submission[]>("contact-submissions.json", []);
    submissions.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("[contact-submissions] Error reading submissions:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const submissions = await readJSON<Submission[]>("contact-submissions.json", []);
    const filtered = submissions.filter((s) => s.id !== id);

    if (filtered.length === submissions.length) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const saved = await writeJSON("contact-submissions.json", filtered);
    if (!saved) {
      return NextResponse.json({ error: "Failed to delete — could not save to GitHub" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Submission deleted" });
  } catch (error) {
    console.error("[contact-submissions] Error deleting submission:", error);
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 });
  }
}
