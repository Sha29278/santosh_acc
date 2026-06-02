"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ComposedChart,
  Area,
} from "recharts";
import { Card } from "@/components/ui/card";
import SectionTitle from "@/components/ui/section-title";

// ─── Color Palette ───────────────────────────────────────────────────────

const COLORS = {
  blue: "#6366F1",
  indigo: "#4F46E5",
  cyan: "#06B6D4",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  slate: "#64748B",
  purple: "#8B5CF6",
  teal: "#14B8A6",
  orange: "#F97316",
};

const SLAB_COLORS = [
  "#10B981",
  "#06B6D4",
  "#6366F1",
  "#8B5CF6",
  "#F59E0B",
  "#F97316",
  "#F43F5E",
];

// ─── Tax Slab Rate Chart ────────────────────────────────────────────────

interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

interface SlabRateChartProps {
  slabs: TaxSlab[];
  regimeName: string;
  regimeLabel: string;
  highlightSlab?: number;
}

export function SlabRateChart({
  slabs,
  regimeName,
  regimeLabel,
  highlightSlab,
}: SlabRateChartProps) {
  const data = useMemo(() => {
    return slabs.map((slab, idx) => {
      const label = `₹${(slab.min / 100000).toFixed(0)}L${slab.max ? ` – ₹${(slab.max / 100000).toFixed(0)}L` : "+"}`;
      return {
        name: label,
        rate: slab.rate,
        fill: highlightSlab === idx ? COLORS.amber : SLAB_COLORS[idx % SLAB_COLORS.length],
        label: `${slab.rate}%`,
      };
    });
  }, [slabs, highlightSlab]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Tax Slab Rates — {regimeLabel}
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Visual representation of tax rates across income slabs
      </p>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#64748B" }}
              domain={[0, 35]}
              ticks={[0, 5, 10, 15, 20, 25, 30]}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#475569" }}
              width={90}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: any) => [`${value}%`, "Tax Rate"]}
            />
            <Bar
              dataKey="rate"
              radius={[0, 6, 6, 0]}
              barSize={28}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.fill}
                  opacity={highlightSlab === idx ? 1 : 0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Tax Breakdown Donut Chart ───────────────────────────────────────────

interface TaxBreakdown {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
}

interface TaxBreakdownChartProps {
  breakdown: TaxBreakdown;
}

export function TaxBreakdownDonut({ breakdown }: TaxBreakdownChartProps) {
  const data = useMemo(() => {
    const items = [
      {
        name: "Income Tax",
        value: breakdown.taxAfterRebate,
        color: COLORS.blue,
        label: `₹${breakdown.taxAfterRebate.toLocaleString("en-IN")}`,
      },
    ];

    if (breakdown.cess > 0) {
      items.push({
        name: "Health & Education Cess (4%)",
        value: breakdown.cess,
        color: COLORS.cyan,
        label: `₹${breakdown.cess.toLocaleString("en-IN")}`,
      });
    }

    if (breakdown.rebate > 0) {
      items.push({
        name: "Section 87A Rebate",
        value: breakdown.rebate,
        color: COLORS.emerald,
        label: `−₹${breakdown.rebate.toLocaleString("en-IN")}`,
      });
    }

    return items;
  }, [breakdown]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">Tax Breakdown</h4>
        <p className="text-xs text-slate-500 mb-4">Distribution of tax components</p>
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
          No tax liability to display
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Tax Breakdown
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Distribution of your tax components
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-48 w-full sm:w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "13px",
                }}
                formatter={(value: any) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs sm:text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600">{item.name}</span>
              </div>
              <span className="font-semibold text-slate-800">
                ₹{item.value.toLocaleString("en-IN")}
                {total > 0 && (
                  <span className="text-slate-400 font-normal ml-1">
                    ({((item.value / total) * 100).toFixed(1)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-2 mt-2">
            <div className="flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Total Tax</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Regime Comparison Chart ─────────────────────────────────────────────

interface RegimeComparisonChartProps {
  currentIncome: number;
  oldSlabs: TaxSlab[];
  newSlabs: TaxSlab[];
  oldStandardDeduction: number;
  newStandardDeduction: number;
  oldRebateLimit: number;
  newRebateLimit: number;
  oldRebateMax: number;
  newRebateMax: number;
}

function calculateTaxForIncome(
  income: number,
  slabs: TaxSlab[],
  standardDeduction: number,
  rebateLimit: number,
  rebateMax: number
): number {
  const taxableIncome = Math.max(0, income - standardDeduction);
  let tax = 0;

  for (const slab of slabs) {
    const slabMin = slab.min;
    const slabMax = slab.max ?? Infinity;
    const slabIncome = Math.max(0, Math.min(taxableIncome, slabMax) - slabMin);
    tax += slabIncome * (slab.rate / 100);
  }

  tax = Math.round(tax);

  let rebate = 0;
  if (taxableIncome <= rebateLimit) {
    rebate = Math.min(tax, rebateMax);
  }

  const taxAfterRebate = Math.max(0, tax - rebate);
  const cess = Math.round(taxAfterRebate * 0.04);
  return taxAfterRebate + cess;
}

export function RegimeComparisonChart({
  currentIncome,
  oldSlabs,
  newSlabs,
  oldStandardDeduction,
  newStandardDeduction,
  oldRebateLimit,
  newRebateLimit,
  oldRebateMax,
  newRebateMax,
}: RegimeComparisonChartProps) {
  const data = useMemo(() => {
    // Generate comparison data around the current income
    const baseIncome = Math.max(500000, Math.round(currentIncome / 500000) * 500000);
    const incomes = [];

    for (let i = -3; i <= 3; i++) {
      const income = Math.max(100000, baseIncome + i * 500000);
      incomes.push(income);
    }

    return incomes.map((income) => {
      const oldTax = calculateTaxForIncome(
        income,
        oldSlabs,
        oldStandardDeduction,
        oldRebateLimit,
        oldRebateMax
      );
      const newTax = calculateTaxForIncome(
        income,
        newSlabs,
        newStandardDeduction,
        newRebateLimit,
        newRebateMax
      );
      return {
        name: `₹${(income / 100000).toFixed(0)}L`,
        "Old Regime": oldTax,
        "New Regime": newTax,
        savings: oldTax - newTax,
        isCurrent: income === baseIncome,
      };
    });
  }, [
    currentIncome,
    oldSlabs,
    newSlabs,
    oldStandardDeduction,
    newStandardDeduction,
    oldRebateLimit,
    newRebateLimit,
    oldRebateMax,
    newRebateMax,
  ]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        New vs Old Regime Comparison
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Tax liability comparison across income levels
      </p>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#64748B" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: any) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "",
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            <Bar
              dataKey="Old Regime"
              fill={COLORS.indigo}
              radius={[4, 4, 0, 0]}
              barSize={20}
              opacity={0.85}
            />
            <Bar
              dataKey="New Regime"
              fill={COLORS.cyan}
              radius={[4, 4, 0, 0]}
              barSize={20}
              opacity={0.85}
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke={COLORS.emerald}
              strokeWidth={2}
              dot={{ fill: COLORS.emerald, r: 4 }}
              name="Savings (Old − New)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {(() => {
        const currentPoint = data.find((d) => d.isCurrent);
        const oldTax = currentPoint?.["Old Regime"] ?? 0;
        const newTax = currentPoint?.["New Regime"] ?? 0;
        const savings = currentPoint?.savings ?? 0;
        return (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="bg-indigo-50 rounded-lg p-2">
              <p className="text-[10px] text-indigo-600 font-medium">Old Regime</p>
              <p className="text-xs font-bold text-indigo-700">
                ₹{oldTax.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-cyan-50 rounded-lg p-2">
              <p className="text-[10px] text-cyan-600 font-medium">New Regime</p>
              <p className="text-xs font-bold text-cyan-700">
                ₹{newTax.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2">
              <p className="text-[10px] text-emerald-600 font-medium">
                {savings > 0 ? "You Save" : "Difference"}
              </p>
              <p className={`text-xs font-bold ${savings > 0 ? "text-emerald-700" : "text-slate-700"}`}>
                ₹{Math.abs(savings).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Tax Liability Progression Chart ─────────────────────────────────────

interface TaxProgressionChartProps {
  currentIncome: number;
  regimeName: string;
  slabs: TaxSlab[];
  standardDeduction: number;
  rebateLimit: number;
  rebateMax: number;
}

export function TaxProgressionChart({
  currentIncome,
  regimeName,
  slabs,
  standardDeduction,
  rebateLimit,
  rebateMax,
}: TaxProgressionChartProps) {
  const data = useMemo(() => {
    const incomes = [];
    const step = Math.max(100000, Math.round(currentIncome / 10));
    const start = Math.max(0, currentIncome - step * 3);
    const end = currentIncome + step * 3;

    for (let income = start; income <= end; income += Math.max(50000, Math.round(step / 2))) {
      const taxableIncome = Math.max(0, income - standardDeduction);
      let tax = 0;

      for (const slab of slabs) {
        const slabMin = slab.min;
        const slabMax = slab.max ?? Infinity;
        const slabIncome = Math.max(0, Math.min(taxableIncome, slabMax) - slabMin);
        tax += slabIncome * (slab.rate / 100);
      }

      tax = Math.round(tax);

      let rebate = 0;
      if (taxableIncome <= rebateLimit) {
        rebate = Math.min(tax, rebateMax);
      }

      const taxAfterRebate = Math.max(0, tax - rebate);
      const cess = Math.round(taxAfterRebate * 0.04);
      const totalTax = taxAfterRebate + cess;
      const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;

      incomes.push({
        income: income,
        label: `₹${(income / 100000).toFixed(1)}L`,
        tax: totalTax,
        effectiveRate: parseFloat(effectiveRate.toFixed(2)),
        isCurrent: income === currentIncome,
      });
    }

    return incomes;
  }, [currentIncome, regimeName, slabs, standardDeduction, rebateLimit, rebateMax]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Tax Liability Progression
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        How your total tax and effective rate change with income
      </p>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#64748B" }}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 35]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: any, name: any) => {
                if (String(name) === "Total Tax") {
                  return [`₹${Number(value).toLocaleString("en-IN")}`, "Total Tax"];
                }
                return [`${value}%`, "Effective Rate"];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="tax"
              name="Total Tax"
              fill={COLORS.blue}
              stroke={COLORS.indigo}
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="effectiveRate"
              name="Effective Rate"
              stroke={COLORS.amber}
              strokeWidth={2}
              dot={{ fill: COLORS.amber, r: 3 }}
              strokeDasharray="4 4"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded" style={{ backgroundColor: COLORS.indigo }} />
          <span>Total Tax (₹)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded border-dashed" style={{ borderTop: `2px dashed ${COLORS.amber}`, height: 0 }} />
          <span>Effective Rate (%)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Deduction Impact Chart (Old Regime) ────────────────────────────────

interface DeductionImpactProps {
  deductions: {
    section80C: number;
    section80D: number;
    section80CCD1B: number;
    hra: number;
    homeLoanInterest: number;
  };
  marginalRate: number;
}

export function DeductionImpactChart({
  deductions,
  marginalRate,
}: DeductionImpactProps) {
  const data = useMemo(() => {
    const items = [
      { name: "Section 80C", key: "section80C" as const, icon: "🛡️", color: "#6366F1" },
      { name: "Section 80D (Health)", key: "section80D" as const, icon: "❤️", color: "#06B6D4" },
      { name: "80CCD(1B) NPS", key: "section80CCD1B" as const, icon: "🎓", color: "#10B981" },
      { name: "Home Loan Interest", key: "homeLoanInterest" as const, icon: "🏠", color: "#F59E0B" },
      { name: "HRA Exemption", key: "hra" as const, icon: "💼", color: "#F43F5E" },
    ];

    return items
      .map((item) => ({
        name: item.name,
        icon: item.icon,
        color: item.color,
        amount: deductions[item.key],
        taxSaved: Math.round(deductions[item.key] * (marginalRate / 100)),
      }))
      .filter((d) => d.amount > 0);
  }, [deductions, marginalRate]);

  const totalTaxSaved = data.reduce((sum, d) => sum + d.taxSaved, 0);
  const totalDeductions = data.reduce((sum, d) => sum + d.amount, 0);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">
          Deduction Impact
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Tax savings from deductions (Old Regime only)
        </p>
        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
          No deductions entered — switch to Old Regime to see impact
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Deduction Impact on Tax
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        How each deduction reduces your tax at {marginalRate}% marginal rate
      </p>
      <div className="space-y-3">
        {data.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-slate-700">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-slate-800">
                  ₹{item.taxSaved.toLocaleString("en-IN")}
                </span>
                <span className="text-slate-400 ml-1.5 text-[10px]">
                  saved
                </span>
              </div>
            </div>
            {/* Stacked bar: deduction portion */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((item.amount / totalDeductions) * 100, 100)}%`,
                  backgroundColor: item.color,
                  opacity: 0.8,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>₹{item.amount.toLocaleString("en-IN")} invested</span>
              <span>{((item.taxSaved / totalTaxSaved) * 100).toFixed(0)}% of savings</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-700 font-medium">Total Tax Saved</span>
          <span className="font-bold text-blue-700">
            ₹{totalTaxSaved.toLocaleString("en-IN")}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          From ₹{totalDeductions.toLocaleString("en-IN")} in deductions at {marginalRate}% rate
        </p>
      </div>
    </div>
  );
}

// ─── Income Distribution Horizontal Bar ──────────────────────────────────

interface IncomeDistributionProps {
  grossIncome: number;
  totalDeductions: number;
  totalTax: number;
  takeHome: number;
}

export function IncomeDistributionBar({
  grossIncome,
  totalDeductions,
  totalTax,
  takeHome,
}: IncomeDistributionProps) {
  if (grossIncome <= 0) return null;

  const deductionsPct = (totalDeductions / grossIncome) * 100;
  const taxPct = (totalTax / grossIncome) * 100;
  const takeHomePct = (takeHome / grossIncome) * 100;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Income Distribution
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        How your gross income is allocated
      </p>

      {/* 100% stacked bar */}
      <div className="w-full h-8 sm:h-10 rounded-xl overflow-hidden flex shadow-sm">
        <div
          className="h-full flex items-center justify-center text-[10px] font-medium text-white transition-all duration-500"
          style={{
            width: `${Math.max(deductionsPct, 2)}%`,
            background: "linear-gradient(135deg, #10B981, #059669)",
          }}
          title={`Deductions: ₹${totalDeductions.toLocaleString("en-IN")}`}
        >
          {deductionsPct > 8 && `Deductions ${deductionsPct.toFixed(1)}%`}
        </div>
        <div
          className="h-full flex items-center justify-center text-[10px] font-medium text-white transition-all duration-500"
          style={{
            width: `${Math.max(taxPct, totalTax > 0 ? 2 : 0)}%`,
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
          }}
          title={`Tax: ₹${totalTax.toLocaleString("en-IN")}`}
        >
          {taxPct > 8 && `Tax ${taxPct.toFixed(1)}%`}
        </div>
        <div
          className="h-full flex items-center justify-center text-[10px] font-medium text-white transition-all duration-500"
          style={{
            width: `${Math.max(takeHomePct, 2)}%`,
            background: "linear-gradient(135deg, #06B6D4, #0891B2)",
          }}
          title={`Take-Home: ₹${takeHome.toLocaleString("en-IN")}`}
        >
          {takeHomePct > 8 && `Take-Home ${takeHomePct.toFixed(1)}%`}
        </div>
      </div>

      {/* Legend & details */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-emerald-50 rounded-lg p-2">
          <div className="text-[18px]">📄</div>
          <p className="text-[10px] font-semibold text-emerald-700 mt-0.5">Deductions</p>
          <p className="text-[10px] text-emerald-600">₹{totalDeductions.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-2">
          <div className="text-[18px]">💰</div>
          <p className="text-[10px] font-semibold text-indigo-700 mt-0.5">Total Tax</p>
          <p className="text-[10px] text-indigo-600">₹{totalTax.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-cyan-50 rounded-lg p-2">
          <div className="text-[18px]">🏦</div>
          <p className="text-[10px] font-semibold text-cyan-700 mt-0.5">Take-Home</p>
          <p className="text-[10px] text-cyan-600">₹{takeHome.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Individual percentages */}
      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400 justify-center">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{deductionsPct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>{taxPct.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-500" />
          <span>{takeHomePct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Marginal Tax Rate Gauge ─────────────────────────────────────────────

interface MarginalRateGaugeProps {
  marginalRate: number;
  taxableIncome: number;
  regime: string;
}

export function MarginalRateGauge({
  marginalRate,
  taxableIncome,
  regime,
}: MarginalRateGaugeProps) {
  const getRateColor = (rate: number) => {
    if (rate <= 5) return { bg: "#10B981", label: "Low", textColor: "text-emerald-600" };
    if (rate <= 10) return { bg: "#06B6D4", label: "Moderate", textColor: "text-cyan-600" };
    if (rate <= 20) return { bg: "#F59E0B", label: "High", textColor: "text-amber-600" };
    if (rate <= 25) return { bg: "#F97316", label: "Very High", textColor: "text-orange-600" };
    return { bg: "#F43F5E", label: "Maximum", textColor: "text-rose-600" };
  };

  const rateInfo = getRateColor(marginalRate);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Marginal Tax Rate
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Highest tax bracket applicable to your income
      </p>

      {/* Gauge display */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36">
          {/* Circular gauge background */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={rateInfo.bg}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${(marginalRate / 30) * 314} 314`}
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold" style={{ color: rateInfo.bg }}>
              {marginalRate}%
            </span>
            <span className={`text-[10px] font-semibold ${rateInfo.textColor} mt-0.5`}>
              {rateInfo.label}
            </span>
          </div>
        </div>

        <div className="mt-4 w-full grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">Taxable Income</p>
            <p className="text-xs font-bold text-slate-800">
              ₹{taxableIncome.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-[10px] text-slate-500">Regime</p>
            <p className="text-xs font-bold text-slate-800 capitalize">
              {regime}
            </p>
          </div>
        </div>

        {/* Rate legend */}
        <div className="mt-3 w-full">
          <div className="w-full h-2 rounded-full overflow-hidden flex">
            {[
              { rate: "5%", color: "#10B981", width: 17 },
              { rate: "10%", color: "#06B6D4", width: 17 },
              { rate: "15%", color: "#6366F1", width: 17 },
              { rate: "20%", color: "#F59E0B", width: 17 },
              { rate: "25%", color: "#F97316", width: 16 },
              { rate: "30%", color: "#F43F5E", width: 16 },
            ].map((r, idx) => (
              <div
                key={idx}
                className="h-full flex items-center justify-center text-[6px] font-bold text-white"
                style={{
                  width: `${r.width}%`,
                  backgroundColor: r.color,
                  opacity: marginalRate >= parseInt(r.rate) ? 1 : 0.3,
                }}
              >
                {r.rate}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
            <span>0%</span>
            <span>30%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Surcharge Impact Chart ──────────────────────────────────────────────

interface SurchargeChartProps {
  taxableIncome: number;
  regime?: "old" | "new";
}

export function SurchargeImpactChart({ taxableIncome, regime }: SurchargeChartProps) {
  // Surcharge rates differ: old regime caps at 37% above ₹5Cr, new regime caps at 25%
  const surchargeSlabs = [
    { min: 0, max: 5000000, rate: 0, label: "Nil" },
    { min: 5000000, max: 10000000, rate: 10, label: "10%" },
    { min: 10000000, max: 20000000, rate: 15, label: "15%" },
    { min: 20000000, max: 50000000, rate: 25, label: "25%" },
    { min: 50000000, max: null, rate: regime === "new" ? 25 : 37, label: regime === "new" ? "25%" : "37%" },
  ];

  const currentSlab = surchargeSlabs.find(
    (s) => taxableIncome >= s.min && (s.max === null || taxableIncome <= s.max)
  );

  const data = useMemo(() => {
    return surchargeSlabs.map((slab, idx) => ({
      name: slab.min === 0
        ? "Up to ₹50L"
        : slab.max === null
          ? `Above ₹${(slab.min / 10000000).toFixed(0)}Cr`
          : `₹${(slab.min / 10000000).toFixed(0)}Cr – ₹${(slab.max / 10000000).toFixed(0)}Cr`,
      rate: slab.rate,
      isCurrent: slab === currentSlab,
    }));
  }, [taxableIncome]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        Surcharge Slabs
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Additional tax on high-income earners
      </p>

      <div className="h-48 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#64748B" }}
              domain={[0, 40]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10, fill: "#475569" }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
              formatter={(value: any) => [`${value}%`, "Surcharge Rate"]}
            />
            <Bar
              dataKey="rate"
              radius={[0, 6, 6, 0]}
              barSize={22}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.isCurrent ? "#6366F1" : "#E2E8F0"}
                  opacity={entry.isCurrent ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100">
        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div className="text-xs text-slate-600">
            <p className="font-semibold text-orange-800 mb-0.5">
              {currentSlab && currentSlab.rate > 0
                ? `Your surcharge rate: ${currentSlab.rate}%`
                : "No surcharge applies to your income"}
            </p>
            <p>
              Surcharge is calculated on the income tax amount before cess.
              Health & Education Cess (4%) is then applied on (tax + surcharge).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chart Section Container ─────────────────────────────────────────────

interface IncomeTaxChartsProps {
  result: TaxBreakdown & { currentIncome: number; regime: "old" | "new" };
  oldSlabs: TaxSlab[];
  newSlabs: TaxSlab[];
  oldStandardDeduction: number;
  newStandardDeduction: number;
  oldRebateLimit: number;
  newRebateLimit: number;
  oldRebateMax: number;
  newRebateMax: number;
  deductions?: {
    section80C: number;
    section80D: number;
    section80CCD1B: number;
    hra: number;
    homeLoanInterest: number;
  };
}

export function IncomeTaxCharts({
  result,
  oldSlabs,
  newSlabs,
  oldStandardDeduction,
  newStandardDeduction,
  oldRebateLimit,
  newRebateLimit,
  oldRebateMax,
  newRebateMax,
  deductions,
}: IncomeTaxChartsProps) {
  const activeSlabs = result.regime === "new" ? newSlabs : oldSlabs;

  // Find marginal rate: the rate of the highest slab the taxable income falls into
  const marginalRate = (() => {
    const taxableIncome = result.taxableIncome;
    let highestRate = 0;
    for (const slab of activeSlabs) {
      const slabMax = slab.max ?? Infinity;
      const slabMin = slab.min;
      // If taxable income exceeds the slab minimum, this rate applies to some income
      if (taxableIncome > slabMin) {
        highestRate = slab.rate;
      }
    }
    return highestRate;
  })();

  // Check if any deductions are provided
  const hasDeductions = deductions && Object.values(deductions).some((v) => v > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <SectionTitle
        badge="Interactive Charts"
        title="Tax Visualizations"
        subtitle="Understand your tax liability at a glance with interactive charts and graphs."
        className="mb-6"
      />

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Row 1: Slab Rates + Tax Breakdown */}
        <SlabRateChart
          slabs={activeSlabs}
          regimeName={result.regime}
          regimeLabel={result.regime === "new" ? "New Tax Regime" : "Old Tax Regime"}
        />
        <TaxBreakdownDonut breakdown={result} />

        {/* Row 2: Marginal Rate + Income Distribution */}
        <MarginalRateGauge
          marginalRate={marginalRate}
          taxableIncome={result.taxableIncome}
          regime={result.regime}
        />
        <IncomeDistributionBar
          grossIncome={result.grossIncome}
          totalDeductions={result.totalDeductions}
          totalTax={result.totalTax}
          takeHome={result.grossIncome - result.totalTax}
        />

        {/* Row 3: Regime Comparison + Tax Progression */}
        <RegimeComparisonChart
          currentIncome={result.currentIncome}
          oldSlabs={oldSlabs}
          newSlabs={newSlabs}
          oldStandardDeduction={oldStandardDeduction}
          newStandardDeduction={newStandardDeduction}
          oldRebateLimit={oldRebateLimit}
          newRebateLimit={newRebateLimit}
          oldRebateMax={oldRebateMax}
          newRebateMax={newRebateMax}
        />
        <TaxProgressionChart
          currentIncome={result.currentIncome}
          regimeName={result.regime}
          slabs={activeSlabs}
          standardDeduction={result.regime === "new" ? newStandardDeduction : oldStandardDeduction}
          rebateLimit={result.regime === "new" ? newRebateLimit : oldRebateLimit}
          rebateMax={result.regime === "new" ? newRebateMax : oldRebateMax}
        />

        {/* Row 4: Deduction Impact + Surcharge (only for old regime with deductions) */}
        {result.regime === "old" && hasDeductions && (
          <DeductionImpactChart
            deductions={deductions!}
            marginalRate={marginalRate}
          />
        )}
        <SurchargeImpactChart
          taxableIncome={result.taxableIncome}
          regime={result.regime}
        />
      </div>
    </div>
  );
}
