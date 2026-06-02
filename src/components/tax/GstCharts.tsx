"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ComposedChart,
  Line,
} from "recharts";
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

const GST_COLORS = ["#6366F1", "#06B6D4", "#10B981", "#F59E0B", "#F43F5E"];

// ─── GST Breakdown Donut Chart ───────────────────────────────────────────

interface GstBreakdownProps {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  total: number;
  rate: number;
  transactionType: "intra-state" | "inter-state";
  mode: "exclusive" | "inclusive";
}

export function GstBreakdownDonut({
  taxableValue,
  cgst,
  sgst,
  igst,
  totalGst,
  total,
  rate,
  transactionType,
  mode,
}: GstBreakdownProps) {
  const data = useMemo(() => {
    const items: { name: string; value: number; color: string }[] = [
      { name: "Taxable Value", value: taxableValue, color: COLORS.emerald },
    ];

    if (transactionType === "intra-state") {
      if (cgst > 0) items.push({ name: `CGST (${rate / 2}%)`, value: cgst, color: COLORS.blue });
      if (sgst > 0) items.push({ name: `SGST (${rate / 2}%)`, value: sgst, color: COLORS.cyan });
    } else {
      if (igst > 0) items.push({ name: `IGST (${rate}%)`, value: igst, color: COLORS.indigo });
    }

    return items;
  }, [taxableValue, cgst, sgst, igst, totalGst, rate, transactionType]);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        GST Amount Breakdown
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Visual split of taxable value and tax components
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-48 w-full sm:w-48 flex-shrink-0">
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
                  `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
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
                ₹{item.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                <span className="text-slate-400 font-normal ml-1">
                  ({((item.value / totalValue) * 100).toFixed(1)}%)
                </span>
              </span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-2 mt-2">
            <div className="flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-400 text-center">
        {mode === "exclusive" ? "GST added to base amount" : "Amount already includes GST"} &middot; {rate}% GST &middot;{" "}
        {transactionType === "intra-state"
          ? `${rate / 2}% CGST + ${rate / 2}% SGST`
          : `${rate}% IGST`}
      </div>
    </div>
  );
}

// ─── GST Rate Comparison Chart ───────────────────────────────────────────

interface GstRateComparisonProps {
  amount: number;
  selectedRate: number;
  mode: "exclusive" | "inclusive";
}

export function GstRateComparison({
  amount,
  selectedRate,
  mode,
}: GstRateComparisonProps) {
  const data = useMemo(() => {
    const rates = [0, 5, 12, 18, 28];
    const num = parseFloat(String(amount)) || 0;

    return rates.map((rate) => {
      let gstAmount: number;
      let totalAmount: number;

      if (mode === "exclusive") {
        gstAmount = num * (rate / 100);
        totalAmount = num + gstAmount;
      } else {
        totalAmount = num;
        gstAmount = num - num * (100 / (100 + rate));
      }

      return {
        name: `${rate}%`,
        rate,
        gstAmount: Math.round(gstAmount * 100) / 100,
        total: Math.round(totalAmount * 100) / 100,
        isSelected: rate === selectedRate,
        gstPercent: rate,
      };
    });
  }, [amount, selectedRate, mode]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        GST Rate Comparison
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        Compare GST amounts across all rate slabs
      </p>
      <div className="h-56 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748B" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "13px",
              }}
              formatter={(value: any, name: any) => {
                if (String(name) === "gstAmount") {
                  return [`₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, "GST Amount"];
                }
                return [`₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, "Total"];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            <Bar
              dataKey="gstAmount"
              name="GST Amount"
              radius={[4, 4, 0, 0]}
              barSize={24}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.isSelected ? COLORS.blue : `${COLORS.blue}55`}
                  opacity={entry.isSelected ? 1 : 0.6}
                />
              ))}
            </Bar>
            <Bar
              dataKey="total"
              name="Total Amount"
              radius={[4, 4, 0, 0]}
              barSize={24}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.isSelected ? COLORS.cyan : `${COLORS.cyan}55`}
                  opacity={entry.isSelected ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1 text-center">
        {data.map((d) => (
          <div
            key={d.rate}
            className={`rounded-lg p-1.5 text-[10px] ${
              d.isSelected
                ? "bg-blue-100 text-blue-700 font-semibold ring-2 ring-blue-300"
                : "bg-slate-50 text-slate-500"
            }`}
          >
            <div>{d.rate}%</div>
            <div className="font-medium">
              ₹{d.gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 0 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── GST vs Income Visualization ─────────────────────────────────────────

interface GstVsIncomeProps {
  gstAmount: number;
  gstRate: number;
}

export function GstVsIncomeChart({ gstAmount, gstRate }: GstVsIncomeProps) {
  // Compare GST at different transaction values at the same rate
  const data = useMemo(() => {
    const baseAmount = Math.max(1000, gstAmount * 2);
    const values = [baseAmount * 0.25, baseAmount * 0.5, baseAmount * 0.75, baseAmount, baseAmount * 1.5, baseAmount * 2];

    return values.map((val) => {
      const gst = val * (gstRate / 100);
      return {
        name: `₹${(val / 1000).toFixed(0)}K`,
        "Base Amount": Math.round(val),
        [`GST (${gstRate}%)`]: Math.round(gst),
        total: Math.round(val + gst),
      };
    });
  }, [gstAmount, gstRate]);

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-1">
        GST Impact at Scale
      </h4>
      <p className="text-xs text-slate-500 mb-4">
        How GST scales with transaction value at {gstRate}% rate
      </p>
      <div className="h-56 sm:h-64">
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
                fontSize: "13px",
              }}
              formatter={(value: any) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "",
              ]}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Bar
              dataKey="Base Amount"
              stackId="a"
              fill={COLORS.emerald}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey={`GST (${gstRate}%)`}
              stackId="a"
              fill={COLORS.blue}
              radius={[4, 4, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={COLORS.amber}
              strokeWidth={2}
              dot={false}
              name="Total"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span>Base Amount</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-500" />
          <span>GST</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 rounded" style={{ backgroundColor: COLORS.amber, height: "2px" }} />
          <span>Total</span>
        </div>
      </div>
    </div>
  );
}

// ─── GST Charts Container ────────────────────────────────────────────────

interface GstChartsProps {
  amount: number;
  rate: number;
  mode: "exclusive" | "inclusive";
  transactionType: "intra-state" | "inter-state";
  results: {
    taxableValue: number;
    cgst: number;
    sgst: number;
    igst: number;
    totalGst: number;
    total: number;
  } | null;
}

export function GstCharts({
  amount,
  rate,
  mode,
  transactionType,
  results,
}: GstChartsProps) {
  if (!results) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <SectionTitle
        badge="GST Visualizations"
        title="GST Charts & Analysis"
        subtitle="Visual breakdown and comparison of your GST calculation across different rates."
        className="mb-6"
      />

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <GstBreakdownDonut
          taxableValue={results.taxableValue}
          cgst={results.cgst}
          sgst={results.sgst}
          igst={results.igst}
          totalGst={results.totalGst}
          total={results.total}
          rate={rate}
          transactionType={transactionType}
          mode={mode}
        />
        <GstRateComparison
          amount={amount}
          selectedRate={rate}
          mode={mode}
        />
        <div className="lg:col-span-2">
          <GstVsIncomeChart
            gstAmount={results.totalGst}
            gstRate={rate}
          />
        </div>
      </div>
    </div>
  );
}
