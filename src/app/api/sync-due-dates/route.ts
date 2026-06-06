import { NextResponse } from "next/server";
import { generateDueDates } from "@/lib/generate-due-dates";
import { readJSON, writeJSON } from "@/lib/admin/storage";
import type { DueDateOverride } from "@/lib/generate-due-dates";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Sync due dates by:
 * 1. Programmatically generating all due dates from tax rules
 * 2. Applying any admin overrides on top (for government deadline extensions)
 *
 * Runs daily at 12 AM via Vercel Cron and via the manual sync button.
 */
export async function GET() {
  try {
    let items = generateDueDates();

    // Apply admin overrides (e.g., when government extends a deadline)
    const overrides = await readJSON<DueDateOverride[]>("due-date-overrides.json", []);
    const activeOverrides = overrides.filter((o) => o.active);

    if (activeOverrides.length > 0) {
      items = items.map((item) => {
        const ov = activeOverrides.find((o) => o.id === item.id);
        if (ov) {
          return {
            ...item,
            dueDate: ov.dueDate,
            description: `${item.description} (${ov.reason})`,
          };
        }
        return item;
      });
    }

    // Persist to due-dates.json so the rest of the app can read it
    const saved = await writeJSON("due-dates.json", items);

    return NextResponse.json({
      success: saved,
      message: saved
        ? `Synced ${items.length} due dates (${activeOverrides.length} overrides applied) for FY ${getFinancialYear()}`
        : `Generated ${items.length} due dates but failed to persist — GitHub save failed. Check your GITHUB_TOKEN.`,
      count: items.length,
      overridesApplied: activeOverrides.length,
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

function getFinancialYear(): string {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const start = m >= 4 ? y : y - 1;
  return `${start}-${start + 1}`;
}
