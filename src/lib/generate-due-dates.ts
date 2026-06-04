/**
 * Programmatic due date generator for Indian GST and Income Tax.
 *
 * No hardcoded absolute dates. Every date is calculated from the
 * current date using the rules defined in the GST Act and Income Tax Act.
 *
 * ── GST Monthly ────────────────────────────────────────────────────────────
 *  GSTR-7  (TDS)       → 10th of next month
 *  GSTR-8  (TCS)       → 10th of next month
 *  GSTR-1  (Outward)   → 11th of next month
 *  GSTR-6  (ISD)       → 13th of next month
 *  GSTR-3B (Summary)   → 20th of next month
 *  GSTR-5  (Non-Res)   → 20th of next month
 *
 * ── GST Quarterly ─────────────────────────────────────────────────────────
 *  IFF + GSTR-1 (QRMP) → 13th of month after quarter end
 *  CMP-08  (Composition) → 18th of month after quarter end
 *  GSTR-3B (QRMP)      → 24th of month after quarter end
 *
 * ── GST Annual ────────────────────────────────────────────────────────────
 *  GSTR-4  (Comp. Annual) → 30th April of next FY
 *  GSTR-9  (Annual)       → 31st December of next FY
 *  GSTR-9C (Recon.)       → 31st December of next FY
 *
 * ── Income Tax ────────────────────────────────────────────────────────────
 *  Advance Tax 1 (15%)  → 15 June
 *  Advance Tax 2 (45%)  → 15 September
 *  Advance Tax 3 (75%)  → 15 December
 *  Advance Tax 4 (100%) → 15 March
 *  ITR Non-Audit        → 31 July
 *  Tax Audit Report     → 30 September
 *  ITR Audit            → 31 October
 *  ITR Transfer Pricing → 30 November
 *  TDS/TCS Q1           → 31 July
 *  TDS/TCS Q2           → 31 October
 *  TDS/TCS Q3           → 31 January
 *  TDS/TCS Q4           → 31 May
 */

export interface DueDateItem {
  id: string;
  category: "gst" | "income-tax";
  form: string;
  title: string;
  description: string;
  period: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  type: string;
  url: string;
}

export interface DueDateOverride {
  /** The id of the due date item this override applies to */
  id: string;
  /** New due date in YYYY-MM-DD format */
  dueDate: string;
  /** Reason for the override (e.g. "Government notification dated 15 June 2026") */
  reason: string;
  /** Optional label shown next to the date (e.g. "Extended") */
  label?: string;
  /** Whether this override is active */
  active: boolean;
  /** When this override was created/updated */
  updatedAt: string;
}

/** Helper: build a Date for a given day/month in a year, respecting month boundaries */
function safeDate(year: number, month: number, day: number): Date {
  // Clamp day to max days in month
  const maxDay = new Date(year, month, 0).getDate();
  return new Date(Date.UTC(year, month - 1, Math.min(day, maxDay)));
}

/** Format a Date as YYYY-MM-DD */
function toISO(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Month names for period display */
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/** Quarter helper */
function quarterLabel(q: number, fyBase: number): string {
  const starts = ["April","July","October","January"];
  const ends = ["June","September","December","March"];
  return `${starts[q-1]}–${ends[q-1]} ${q === 4 ? fyBase + 1 : fyBase} (Q${q})`;
}

// ─── MAIN GENERATOR ──────────────────────────────────────────────────────

export function generateDueDates(): DueDateItem[] {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth() + 1; // 1-12

  // Financial year: April to March
  // If current month is Jan-Mar, FY started previous year
  const fyStartYear = currentMonth >= 4 ? currentYear : currentYear - 1;
  const fyEndYear = fyStartYear + 1;
  const assessmentYear = fyEndYear; // AY = FY end year

  const items: DueDateItem[] = [];
  const fyLabel = `FY ${fyStartYear}-${fyEndYear}`;
  const ayLabel = `AY ${assessmentYear}-${assessmentYear + 1} (FY ${fyStartYear}-${fyEndYear})`;

  // ── 1. MONTHLY GST RETURNS ─────────────────────────────────────────
  // Generate from April of current FY to March of next FY, limited to
  // a reasonable window (past 2 months + next 11 months)
  const startMonth = Math.max(1, currentMonth - 2);
  const endMonth = currentMonth + 11;

  for (let m = startMonth; m <= endMonth; m++) {
    // Normalize to calendar month (1-12) and year
    const calMonth = ((m - 1) % 12) + 1;
    const calYear = fyStartYear + Math.floor((m - 1) / 12);

    // The month AFTER the period (for due date calculation)
    const nextMonth = calMonth === 12 ? 1 : calMonth + 1;
    const nextMonthYear = calMonth === 12 ? calYear + 1 : calYear;

    const periodLabel = `${MONTHS[calMonth - 1]} ${calYear}`;

    // Shared due month/year for all monthly returns
    const dueYear = nextMonthYear;
    const dueM = nextMonth;

    // GSTR-7 (TDS Return) — 10th of next month
    items.push({
      id: `gst-gstr7-${periodLabel.toLowerCase().replace(/\s/g, "")}`,
      category: "gst",
      form: "GSTR-7",
      title: "GSTR-7 (TDS Return)",
      description: `Return for TDS deducted under GST for ${periodLabel}`,
      period: periodLabel,
      dueDate: toISO(safeDate(dueYear, dueM, 10)),
      type: "monthly",
      url: "https://www.gst.gov.in/",
    });

    // GSTR-8 (TCS Return) — 10th of next month
    items.push({
      id: `gst-gstr8-${periodLabel.toLowerCase().replace(/\s/g, "")}`,
      category: "gst",
      form: "GSTR-8",
      title: "GSTR-8 (TCS Return)",
      description: `Return for TCS collected by e-commerce operators for ${periodLabel}`,
      period: periodLabel,
      dueDate: toISO(safeDate(dueYear, dueM, 10)),
      type: "monthly",
      url: "https://www.gst.gov.in/",
    });

    // GSTR-1 (Outward Supply) — 11th of next month
    items.push({
      id: `gst-gstr1-${periodLabel.toLowerCase().replace(/\s/g, "")}`,
      category: "gst",
      form: "GSTR-1",
      title: "GSTR-1 (Outward Supply)",
      description: `Details of outward supplies and exports for ${periodLabel}`,
      period: periodLabel,
      dueDate: toISO(safeDate(dueYear, dueM, 11)),
      type: "monthly",
      url: "https://www.gst.gov.in/",
    });

    // GSTR-6 (ISD Return) — 13th of next month
    items.push({
      id: `gst-gstr6-${periodLabel.toLowerCase().replace(/\s/g, "")}`,
      category: "gst",
      form: "GSTR-6",
      title: "GSTR-6 (ISD Return)",
      description: `Monthly return for Input Service Distributors for ${periodLabel}`,
      period: periodLabel,
      dueDate: toISO(safeDate(dueYear, dueM, 13)),
      type: "monthly",
      url: "https://www.gst.gov.in/",
    });

    // GSTR-3B (Monthly Summary) — 20th of next month
    items.push({
      id: `gst-gstr3b-${periodLabel.toLowerCase().replace(/\s/g, "")}`,
      category: "gst",
      form: "GSTR-3B",
      title: "GSTR-3B (Monthly Return)",
      description: `Summary return of inward and outward supplies for ${periodLabel}`,
      period: periodLabel,
      dueDate: toISO(safeDate(dueYear, dueM, 20)),
      type: "monthly",
      url: "https://www.gst.gov.in/",
    });

    // GSTR-5 (Non-Resident) — 20th of next month
    items.push({
      id: `gst-gstr5-${periodLabel.toLowerCase().replace(/\s/g, "")}`,
      category: "gst",
      form: "GSTR-5",
      title: "GSTR-5 (Non-Resident)",
      description: `Monthly return for non-resident taxable persons for ${periodLabel}`,
      period: periodLabel,
      dueDate: toISO(safeDate(dueYear, dueM, 20)),
      type: "monthly",
      url: "https://www.gst.gov.in/",
    });
  }

  // ── 2. QUARTERLY GST (QRMP) ──────────────────────────────────────
  for (let q = 1; q <= 4; q++) {
    const qStartMonth = (q - 1) * 3 + 1; // 1, 4, 7, 10
    const qEndMonth = q * 3; // 3, 6, 9, 12
    const dueMonth = qEndMonth + 1; // month after quarter end
    const dueMonthYear = dueMonth > 12 ? fyEndYear + 1 : fyEndYear;
    const dueMonthNormalized = dueMonth > 12 ? 1 : dueMonth;

    const qLabel = quarterLabel(q, fyStartYear);

    // IFF + Quarterly GSTR-1 — 13th of month after quarter
    items.push({
      id: `gst-iff-q${q}`,
      category: "gst",
      form: "IFF",
      title: "IFF (Invoice Furnishing Facility)",
      description: `For QRMP taxpayers — invoices of supplies for ${qLabel}`,
      period: qLabel,
      dueDate: toISO(safeDate(dueMonthYear, dueMonthNormalized, 13)),
      type: "quarterly",
      url: "https://www.gst.gov.in/",
    });

    items.push({
      id: `gst-gstr1-q${q}`,
      category: "gst",
      form: "GSTR-1 (Quarterly)",
      title: "GSTR-1 Quarterly (QRMP)",
      description: `Outward supply details for QRMP taxpayers for ${qLabel}`,
      period: qLabel,
      dueDate: toISO(safeDate(dueMonthYear, dueMonthNormalized, 13)),
      type: "quarterly",
      url: "https://www.gst.gov.in/",
    });

    // CMP-08 (Composition) — 18th of month after quarter
    items.push({
      id: `gst-cmp08-q${q}`,
      category: "gst",
      form: "CMP-08",
      title: "CMP-08 (Composition Return)",
      description: `Payment of tax by composition dealers for ${qLabel}`,
      period: qLabel,
      dueDate: toISO(safeDate(dueMonthYear, dueMonthNormalized, 18)),
      type: "quarterly",
      url: "https://www.gst.gov.in/",
    });

    // GSTR-3B Quarterly (QRMP) — 24th of month after quarter
    items.push({
      id: `gst-gstr3b-q${q}`,
      category: "gst",
      form: "GSTR-3B (Quarterly)",
      title: "GSTR-3B Quarterly (QRMP)",
      description: `Summary return for QRMP taxpayers for ${qLabel}`,
      period: qLabel,
      dueDate: toISO(safeDate(dueMonthYear, dueMonthNormalized, 24)),
      type: "quarterly",
      url: "https://www.gst.gov.in/",
    });
  }

  // ── 3. ANNUAL GST ──────────────────────────────────────────────────
  const nextFyEndYear = fyEndYear + 1;

  // GSTR-4 (Composition Annual) — 30th April of next FY
  items.push({
    id: "gst-gstr4",
    category: "gst",
    form: "GSTR-4",
    title: "GSTR-4 (Annual Composition)",
    description: `Annual return for composition dealers for ${fyLabel}`,
    period: fyLabel,
    dueDate: toISO(safeDate(nextFyEndYear, 4, 30)),
    type: "annual",
    url: "https://www.gst.gov.in/",
  });

  // GSTR-9 (Annual Return) — 31st December of next FY
  items.push({
    id: "gst-gstr9",
    category: "gst",
    form: "GSTR-9",
    title: "GSTR-9 (Annual Return)",
    description: `Annual GST return for regular taxpayers for ${fyLabel}`,
    period: fyLabel,
    dueDate: toISO(safeDate(nextFyEndYear, 12, 31)),
    type: "annual",
    url: "https://www.gst.gov.in/",
  });

  // GSTR-9C (Reconciliation) — 31st December of next FY
  items.push({
    id: "gst-gstr9c",
    category: "gst",
    form: "GSTR-9C",
    title: "GSTR-9C (Reconciliation)",
    description: `Self-certified reconciliation statement for ${fyLabel}`,
    period: fyLabel,
    dueDate: toISO(safeDate(nextFyEndYear, 12, 31)),
    type: "annual",
    url: "https://www.gst.gov.in/",
  });

  // ── 4. INCOME TAX ─────────────────────────────────────────────────

  // Advance Tax Installments
  const advanceTaxInstallments = [
    { inst: 1, pct: "15%", dueMonth: 6, dueDay: 15, desc: "Pay 15% of estimated tax liability" },
    { inst: 2, pct: "45%", dueMonth: 9, dueDay: 15, desc: "Pay up to 45% of estimated tax liability (cumulative)" },
    { inst: 3, pct: "75%", dueMonth: 12, dueDay: 15, desc: "Pay up to 75% of estimated tax liability (cumulative)" },
    { inst: 4, pct: "100%", dueMonth: 3, dueDay: 15, desc: "Pay 100% of estimated tax liability (cumulative)" },
  ];

  for (const at of advanceTaxInstallments) {
    const dueYear = at.inst <= 3 ? fyStartYear : fyEndYear;
    items.push({
      id: `it-advance-tax-${at.inst}`,
      category: "income-tax",
      form: "Advance Tax",
      title: `${at.inst}${at.inst === 1 ? "st" : at.inst === 2 ? "nd" : at.inst === 3 ? "rd" : "th"} Installment — Advance Tax`,
      description: `${at.desc} for ${fyLabel}`,
      period: fyLabel,
      dueDate: toISO(safeDate(dueYear, at.dueMonth, at.dueDay)),
      type: "advance-tax",
      url: "https://eportal.incometax.gov.in/",
    });
  }

  // ITR Filing dates
  // Non-Audit: 31 July of assessment year
  items.push({
    id: "it-itr-non-audit",
    category: "income-tax",
    form: "ITR Filing",
    title: "ITR Filing — Non-Audit Cases",
    description: `File Income Tax Return for individuals, HUFs (non-audit) for ${ayLabel}`,
    period: ayLabel,
    dueDate: toISO(safeDate(assessmentYear, 7, 31)),
    type: "annual",
    url: "https://eportal.incometax.gov.in/",
  });

  // Tax Audit Report: 30 September of assessment year
  items.push({
    id: "it-tax-audit-report",
    category: "income-tax",
    form: "Tax Audit",
    title: "Tax Audit Report Due",
    description: `Furnish tax audit report under Section 44AB for ${fyLabel}`,
    period: fyLabel,
    dueDate: toISO(safeDate(assessmentYear, 9, 30)),
    type: "annual",
    url: "https://eportal.incometax.gov.in/",
  });

  // ITR Audit: 31 October of assessment year
  items.push({
    id: "it-itr-audit",
    category: "income-tax",
    form: "ITR Filing",
    title: "ITR Filing — Audit Cases",
    description: `File Income Tax Return for businesses requiring tax audit for ${ayLabel}`,
    period: ayLabel,
    dueDate: toISO(safeDate(assessmentYear, 10, 31)),
    type: "annual",
    url: "https://eportal.incometax.gov.in/",
  });

  // ITR Transfer Pricing: 30 November of assessment year
  items.push({
    id: "it-itr-transfer-pricing",
    category: "income-tax",
    form: "ITR Filing",
    title: "ITR Filing — Transfer Pricing",
    description: `File ITR for entities requiring transfer pricing report for ${ayLabel}`,
    period: ayLabel,
    dueDate: toISO(safeDate(assessmentYear, 11, 30)),
    type: "annual",
    url: "https://eportal.incometax.gov.in/",
  });

  // TDS/TCS Quarterly Returns
  const tdsQuarters = [
    { q: 1, label: "Q1", period: "April–June", dueMonth: 7, dueDay: 31, dueYear: assessmentYear },
    { q: 2, label: "Q2", period: "July–September", dueMonth: 10, dueDay: 31, dueYear: assessmentYear },
    { q: 3, label: "Q3", period: "October–December", dueMonth: 1, dueDay: 31, dueYear: assessmentYear + 1 },
    { q: 4, label: "Q4", period: "January–March", dueMonth: 5, dueDay: 31, dueYear: assessmentYear + 1 },
  ];

  for (const tds of tdsQuarters) {
    items.push({
      id: `it-tds-q${tds.q}`,
      category: "income-tax",
      form: "TDS Return",
      title: `${tds.label} TDS/TCS Return`,
      description: `Quarterly TDS/TCS return for ${tds.period} ${tds.q === 1 ? fyEndYear : tds.q === 2 ? fyEndYear : tds.q === 3 ? fyEndYear + 1 : fyEndYear + 1}`,
      period: `${tds.period} ${fyLabel}`,
      dueDate: toISO(safeDate(tds.dueYear, tds.dueMonth, tds.dueDay)),
      type: "quarterly",
      url: "https://eportal.incometax.gov.in/",
    });
  }

  // Sort by due date (closest first)
  items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return items;
}
