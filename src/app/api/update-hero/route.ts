import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "@/lib/admin/storage";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const saved = await readJSON<Record<string, Record<string, unknown>>>(
      "site-content.json",
      {} as Record<string, Record<string, unknown>>,
    );

    const hero = saved.hero as Record<string, unknown> | undefined;
    const oldValue = hero?.ctaPrimary as string;

    if (!hero) {
      return NextResponse.json({ error: "No hero section found" }, { status: 400 });
    }

    hero.ctaPrimary = "Our Services";

    const written = await writeJSON("site-content.json", saved);

    return NextResponse.json({
      success: written,
      oldValue,
      newValue: "Our Services",
      message: written
        ? "Hero button updated successfully!"
        : "Failed to write to GitHub",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
