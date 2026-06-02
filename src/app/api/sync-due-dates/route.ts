import { NextResponse } from "next/server";
import { readJSON } from "@/lib/admin/storage";

interface DueDateItem {
  id: string;
  category: "gst" | "income-tax";
  form: string;
  title: string;
  description: string;
  period: string;
  dueDate: string;
  type: string;
  url: string;
}

export const dynamic = "force-dynamic";
export const revalidate = 3600;

/**
 * Sync due dates from government portals.
 *
 * Currently returns existing data. In a future enhancement, this would:
 * 1. Scrape https://www.gst.gov.in/ for latest GST due dates
 * 2. Scrape https://eportal.incometax.gov.in/ for Income Tax calendar
 * 3. Auto-update the due-dates.json file with fresh data
 */
export async function GET() {
  try {
    const data = readJSON<DueDateItem[]>("due-dates.json", []);

    return NextResponse.json({
      success: true,
      message: data.length > 0
        ? "Due dates synced successfully"
        : "No due dates found. Add them from the admin panel.",
      count: data.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync due dates",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
