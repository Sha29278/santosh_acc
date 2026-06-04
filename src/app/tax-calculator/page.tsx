"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  Calculator,
  ArrowRightLeft,
  RefreshCw,
  IndianRupee,
  BadgePercent,
  MapPin,
  Globe,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { GstCharts } from "@/components/tax/GstCharts";

// ─── GST Calculator Logic ───────────────────────────────────────────────

const GST_RATES = [0, 5, 12, 18, 28];
type CalcMode = "exclusive" | "inclusive";
type TransactionType = "intra-state" | "inter-state";

interface GstResults {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  total: number;
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function TaxCalculatorPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s" }} />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.taxCalculator.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              {t.taxCalculator.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {t.taxCalculator.titleHighlight}
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              {t.taxCalculator.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <GstCalculatorSection t={t} />
    </div>
  );
}

// ─── GST Calculator Section ──────────────────────────────────────────────

function GstCalculatorSection({ t }: { t: ReturnType<typeof useLanguage>["t"] }) {
  const [amount, setAmount] = useState<string>("10000");
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<CalcMode>("exclusive");
  const [transactionType, setTransactionType] = useState<TransactionType>("intra-state");
  const [results, setResults] = useState<GstResults | null>(null);
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    let taxableValue: number, gstAmount: number;

    if (mode === "exclusive") {
      taxableValue = num;
      gstAmount = num * (rate / 100);
    } else {
      taxableValue = num * (100 / (100 + rate));
      gstAmount = num - taxableValue;
    }

    const halfGst = gstAmount / 2;

    setResults({
      taxableValue: Math.round(taxableValue * 100) / 100,
      cgst: transactionType === "intra-state" ? Math.round(halfGst * 100) / 100 : 0,
      sgst: transactionType === "intra-state" ? Math.round(halfGst * 100) / 100 : 0,
      igst: transactionType === "inter-state" ? Math.round(gstAmount * 100) / 100 : 0,
      totalGst: Math.round(gstAmount * 100) / 100,
      total: mode === "exclusive" ? Math.round((num + gstAmount) * 100) / 100 : num,
    });
    setCopied(false);
  };

  const handleCopy = () => {
    if (!results) return;
    const text = [
      `AccTax Solutions GST Calculator Result`,
      `-----------------------------`,
      `Amount: ₹${parseFloat(amount).toLocaleString("en-IN")}`,
      `GST Rate: ${rate}%`,
      `Type: ${mode === "exclusive" ? "Exclusive" : "Inclusive"}`,
      `Transaction: ${transactionType === "intra-state" ? "Intra-state (CGST+SGST)" : "Inter-state (IGST)"}`,
      ``,
      `Taxable Value: ₹${results.taxableValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      ...(transactionType === "intra-state"
        ? [
            `CGST (${rate / 2}%): ₹${results.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
            `SGST (${rate / 2}%): ₹${results.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
          ]
        : [`IGST (${rate}%): ₹${results.igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`]),
      `Total GST: ₹${results.totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      `Total Amount: ₹${results.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setAmount("");
    setResults(null);
    setCopied(false);
  };

  return (
    <section className="py-8 pb-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-5 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                {t.taxCalculator.gst.enterDetails}
              </h3>

              {/* Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t.taxCalculator.gst.amount}
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={t.taxCalculator.gst.enterAmount}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-lg font-medium"
                  />
                </div>
              </div>

              {/* GST Rate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-blue-600" />
                  {t.taxCalculator.gst.gstRate}
                </label>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {GST_RATES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRate(r)}
                      className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        rate === r
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20 scale-105"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                  {t.taxCalculator.gst.taxType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode("exclusive")}
                    className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      mode === "exclusive"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {t.taxCalculator.gst.exclusive}
                  </button>
                  <button
                    onClick={() => setMode("inclusive")}
                    className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      mode === "inclusive"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {t.taxCalculator.gst.inclusive}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  {mode === "exclusive"
                    ? t.taxCalculator.gst.exclusiveHint
                    : t.taxCalculator.gst.inclusiveHint}
                </p>
              </div>

              {/* Transaction Type */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  {t.taxCalculator.gst.transactionType}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTransactionType("intra-state")}
                    className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      transactionType === "intra-state"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    {t.taxCalculator.gst.intraState}
                  </button>
                  <button
                    onClick={() => setTransactionType("inter-state")}
                    className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      transactionType === "inter-state"
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    {t.taxCalculator.gst.interState}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  {transactionType === "intra-state"
                    ? t.taxCalculator.gst.intraStateHint
                    : t.taxCalculator.gst.interStateHint}
                </p>
              </div>

              {/* Calculate Button */}
              <div className="flex gap-3">
                <Button
                  onClick={calculate}
                  variant="rainbow"
                  size="lg"
                  className="flex-1"
                >
                  <Calculator className="w-5 h-5" />
                  {t.taxCalculator.gst.calculate}
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  size="lg"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className={`p-5 sm:p-8 relative overflow-hidden h-full ${results ? "" : "flex items-center justify-center"}`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />

              {!results ? (
                <div className="text-center text-slate-400">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="text-lg font-medium text-slate-500">{t.taxCalculator.gst.noResults}</p>
                  <p className="text-sm mt-1">{t.taxCalculator.gst.noResultsHint}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                    <BadgePercent className="w-5 h-5 text-emerald-600" />
                    {t.taxCalculator.gst.understandingGst}
                  </h3>

                  {/* Summary */}
                  <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 border border-emerald-100">
                    <div className="text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
                        {t.taxCalculator.gst.totalAmount}
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                        ₹{results.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {mode === "exclusive" ? "Amount + GST" : "Amount (incl. GST)"} &middot; {rate}% GST
                      </p>
                    </div>
                  </div>

                  {/* Breakdown items */}
                  <div className="space-y-3">
                    <ResultRow label={t.taxCalculator.gst.taxableValue} value={results.taxableValue} color="text-slate-900" />
                    <div className="h-px bg-gray-100" />

                    {transactionType === "intra-state" ? (
                      <>
                        <ResultRow
                          label={`CGST (${rate / 2}%)`}
                          value={results.cgst}
                          color="text-blue-600"
                          prefix="+"
                        />
                        <ResultRow
                          label={`SGST (${rate / 2}%)`}
                          value={results.sgst}
                          color="text-blue-600"
                          prefix="+"
                        />
                      </>
                    ) : (
                      <ResultRow
                        label={`IGST (${rate}%)`}
                        value={results.igst}
                        color="text-indigo-600"
                        prefix="+"
                      />
                    )}

                    <div className="h-px bg-gray-100" />

                    <ResultRow
                      label={t.taxCalculator.gst.totalGst}
                      value={results.totalGst}
                      color="text-amber-600"
                    />
                    <div className="h-px bg-gray-200" />
                    <ResultRow
                      label={t.taxCalculator.gst.grandTotal}
                      value={results.total}
                      color="text-emerald-600 font-bold"
                      className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-3 -mx-3"
                    />
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                  >
                    {copied ? t.taxCalculator.gst.copied : t.taxCalculator.gst.copyResult}
                  </button>

                  {/* Rate info */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <BadgePercent className="w-3.5 h-3.5" />
                    Calculated at {rate}% GST &middot;{" "}
                    {transactionType === "intra-state"
                      ? `${rate / 2}% CGST + ${rate / 2}% SGST`
                      : `${rate}% IGST`}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>

        {/* GST Charts */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <GstCharts
              amount={parseFloat(amount) || 0}
              rate={rate}
              mode={mode}
              transactionType={transactionType}
              results={results}
            />
          </motion.div>
        )}

      </div>

      {/* GST Info Section */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
          <SectionTitle
            badge={t.taxCalculator.gst.understandingGst}
            title={t.taxCalculator.gst.gstHowTitle}
            subtitle={t.taxCalculator.gst.gstHowSubtitle}
            className="mb-6"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { rate: "5%", items: "Essential goods (food, medicines)", color: "from-blue-600 to-indigo-600" },
              { rate: "12%", items: "Processed food, computers, services", color: "from-indigo-600 to-blue-600" },
              { rate: "18%", items: "Most goods & services (standard rate)", color: "from-blue-600 to-cyan-600" },
              { rate: "28%", items: "Luxury goods, sin items", color: "from-indigo-700 to-blue-600" },
            ].map((item) => (
              <div key={item.rate} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.color} mb-0.5 sm:mb-1`}>
                  {item.rate}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.items}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-3">CGST + SGST vs IGST</h4>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">Intra-state (Same state)</p>
                  <p>GST is split equally into CGST (Central) and SGST (State). Each gets half of the total GST rate.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 mb-1">Inter-state (Different states)</p>
                  <p>Full GST rate is applied as IGST (Integrated). No split — the entire tax goes to the central government.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Shared Components ───────────────────────────────────────────────────

function ResultRow({
  label,
  value,
  color,
  prefix,
  className,
}: {
  label: string;
  value: number;
  color: string;
  prefix?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>
        {prefix || ""}₹{value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
      </span>
    </div>
  );
}
