"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  Calculator,
  ArrowRightLeft,
  RefreshCw,
  Sparkles,
  IndianRupee,
  Shield,
  TrendingUp,
} from "lucide-react";
import { IncomeTaxCharts } from "@/components/tax/IncomeTaxCharts";
import TaxSavingDashboard from "@/components/tax/TaxSavingDashboard";
import HraCalculator from "@/components/tax/HraCalculator";
import TakeHomeSalaryCalculator from "@/components/tax/TakeHomeSalary";
import ItrQuiz from "@/components/tax/ItrQuiz";
import DocumentChecklist from "@/components/tax/DocumentChecklist";

// ─── Types & Constants ───────────────────────────────────────────────────

type TaxRegime = "new" | "old";

interface Deductions {
  section80C: number;
  section80D: number;
  section80CCD1B: number;
  hra: number;
  homeLoanInterest: number;
}

interface IncomeTaxResult {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number;
  currentIncome: number;
  regime: TaxRegime;
  marginalRate: number;
}

const OLD_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: null, rate: 30 },
];

const NEW_SLABS = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 5 },
  { min: 800001, max: 1200000, rate: 10 },
  { min: 1200001, max: 1600000, rate: 15 },
  { min: 1600001, max: 2000000, rate: 20 },
  { min: 2000001, max: 2400000, rate: 25 },
  { min: 2400001, max: null, rate: 30 },
];

const DEDUCTION_LABELS: Record<string, string> = {
  section80C: "Section 80C (PPF, ELSS, LIC)",
  section80D: "Section 80D (Health Insurance)",
  section80CCD1B: "NPS Additional (80CCD(1B))",
  hra: "HRA Exemption",
  homeLoanInterest: "Home Loan Interest (Sec 24)",
};

// ─── Main Component ──────────────────────────────────────────────────────

export default function IncomeTaxCalculatorPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-violet-800 to-purple-900">
        <div className="absolute top-10 right-20 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s" }} />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Income Tax Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Income Tax Calculator{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300">
                for India
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Compute your income tax under both old and new tax regimes. Claim deductions, compare regimes, and get a personalized document checklist.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Income Tax Calculator Section */}
      <IncomeTaxSection />

      {/* Tax Saving Dashboard */}
      <TaxSavingSection />

      {/* Charts Section */}
      <ChartsSection />

      {/* HRA Calculator */}
      <section className="py-10 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="HRA Calculator"
            title="HRA Exemption Calculator"
            subtitle="Calculate your House Rent Allowance tax exemption using the least of 3 rule."
            className="mb-8"
          />
          <HraCalculator />
        </div>
      </section>

      {/* Take-Home Salary Calculator */}
      <section className="py-10 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Salary Calculator"
            title="Take-Home Salary Calculator"
            subtitle="See exactly how much of your CTC lands in your bank account after tax and deductions."
            className="mb-8"
          />
          <TakeHomeSalaryCalculator />
        </div>
      </section>

      {/* ITR Form Quiz */}
      <section className="py-10 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="ITR Assistant"
            title="Which ITR Form Should You File?"
            subtitle="Answer 3 quick questions to find out which ITR form is right for you."
            className="mb-8"
          />
          <ItrQuiz />
        </div>
      </section>

      {/* Document Checklist Generator */}
      <section className="py-10 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Document Helper"
            title="Document Checklist Generator"
            subtitle="Get a personalized list of documents you need for filing your Income Tax Return."
            className="mb-8"
          />
          <DocumentChecklist regime="new" />
        </div>
      </section>
    </div>
  );
}

// ─── Income Tax Calculator Section ───────────────────────────────────────

function IncomeTaxSection() {
  const [income, setIncome] = useState("1200000");
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [deductions, setDeductions] = useState<Deductions>({
    section80C: 0,
    section80D: 0,
    section80CCD1B: 0,
    hra: 0,
    homeLoanInterest: 0,
  });
  const [calculated, setCalculated] = useState(false);

  const result = useMemo((): IncomeTaxResult | null => {
    const grossIncome = parseFloat(income);
    if (isNaN(grossIncome) || grossIncome <= 0) return null;

    const standardDeduction = regime === "new" ? 75000 : 50000;

    const otherDeductions = regime === "old"
      ? Math.min(deductions.section80C, 150000) +
        Math.min(deductions.section80D, 50000) +
        Math.min(deductions.section80CCD1B, 50000) +
        deductions.hra +
        Math.min(deductions.homeLoanInterest, 200000)
      : 0;

    const totalDeductions = standardDeduction + otherDeductions;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
    let taxBeforeRebate = 0;
    let marginalRate = 0;

    for (const slab of slabs) {
      const slabMin = slab.min;
      const slabMax = slab.max ?? Infinity;
      const slabIncome = Math.max(0, Math.min(taxableIncome, slabMax) - slabMin);
      taxBeforeRebate += slabIncome * (slab.rate / 100);
      if (taxableIncome > slabMin) {
        marginalRate = slab.rate;
      }
    }

    taxBeforeRebate = Math.round(taxBeforeRebate);

    // Rebate
    const rebateLimit = regime === "new" ? 1200000 : 500000;
    const rebateMax = regime === "new" ? 60000 : 12500;
    let rebate = 0;
    if (taxableIncome <= rebateLimit) {
      rebate = Math.min(taxBeforeRebate, rebateMax);
    }
    rebate = Math.round(rebate);

    const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
    const cess = Math.round(taxAfterRebate * 0.04);
    const totalTax = taxAfterRebate + cess;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

    return {
      grossIncome,
      standardDeduction,
      totalDeductions,
      taxableIncome,
      taxBeforeRebate,
      rebate,
      taxAfterRebate,
      cess,
      totalTax,
      effectiveRate: parseFloat(effectiveRate.toFixed(2)),
      currentIncome: grossIncome,
      regime,
      marginalRate,
    };
  }, [income, regime, deductions]);

  const updateDeduction = (key: keyof Deductions, value: number) => {
    setDeductions((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => setCalculated(true);

  const deductionKeys = Object.keys(deductions) as (keyof Deductions)[];

  return (
    <section className="py-8 pb-16 bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-100/50 rounded-full blur-3xl" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-5 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-violet-600" />
                Income Details
              </h3>

              {/* Monthly Turnover */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Monthly Turnover (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="Enter your monthly turnover"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all text-lg font-medium"
                  />
                </div>
              </div>

              {/* Tax Regime Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-violet-600" />
                  Tax Regime
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRegime("new")}
                    className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      regime === "new"
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    New Regime
                  </button>
                  <button
                    onClick={() => setRegime("old")}
                    className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      regime === "old"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Old Regime
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-slate-500">
                  {regime === "new"
                    ? "Lower tax rates, minimal deductions (only Std. Deduction)"
                    : "Higher tax rates, but claim deductions (80C, 80D, HRA, etc.)"}
                </p>
              </div>

              {/* Deductions (Old Regime) */}
              <AnimatePresence>
                {regime === "old" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 space-y-4"
                  >
                    <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      Deductions (Old Regime)
                    </h4>
                    {deductionKeys.map((key) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-600">
                            {DEDUCTION_LABELS[key]}
                          </label>
                          <span className="text-xs font-semibold text-violet-600">
                            ₹{deductions[key].toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="relative">
                          <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="number"
                            value={deductions[key] || ""}
                            onChange={(e) => updateDeduction(key, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calculate Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCalculate}
                  variant="rainbow"
                  size="lg"
                  className="flex-1"
                >
                  <Calculator className="w-5 h-5" />
                  Calculate Income Tax
                </Button>
                <Button
                  onClick={() => {
                    setCalculated(false);
                    setIncome("1200000");
                    setRegime("new");
                    setDeductions({ section80C: 0, section80D: 0, section80CCD1B: 0, hra: 0, homeLoanInterest: 0 });
                  }}
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
            <Card className={`p-5 sm:p-8 relative overflow-hidden h-full ${calculated && result ? "" : "flex items-center justify-center"}`}>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400" />

              {!calculated || !result ? (
                <div className="text-center text-slate-400">
                  <Calculator className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="text-lg font-medium text-slate-500">No results yet</p>
                  <p className="text-sm mt-1">Enter your income and calculate tax</p>
                </div>
              ) : (
                <>
                  {/* Total Tax Highlight */}
                  <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 border border-emerald-100">
                    <div className="text-center">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-1">
                        Total Tax Payable
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
                        ₹{result.totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </p>
                      <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span>
                          Effective Rate: <strong className="text-slate-700">{result.effectiveRate.toFixed(1)}%</strong>
                        </span>
                        <span>&middot;</span>
                        <span>
                          Regime: <strong className="text-slate-700 capitalize">{result.regime}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3">
                    <ResultRow label="Monthly Turnover" value={result.grossIncome} color="text-slate-900" />
                    <div className="h-px bg-gray-100" />
                    <ResultRow label={`Standard Deduction (₹${result.standardDeduction.toLocaleString("en-IN")})`} value={result.standardDeduction} color="text-emerald-600" prefix="−" />
                    {result.regime === "old" && result.totalDeductions > result.standardDeduction && (
                      <ResultRow
                        label={`Other Deductions (₹${(result.totalDeductions - result.standardDeduction).toLocaleString("en-IN")})`}
                        value={result.totalDeductions - result.standardDeduction}
                        color="text-emerald-600"
                        prefix="−"
                      />
                    )}
                    <div className="h-px bg-gray-100" />
                    <ResultRow label="Taxable Income" value={result.taxableIncome} color="text-blue-600" />

                    {result.taxBeforeRebate > 0 && (
                      <>
                        <div className="h-px bg-gray-100" />
                        <ResultRow label="Tax Before Rebate" value={result.taxBeforeRebate} color="text-amber-600" />
                      </>
                    )}

                    {result.rebate > 0 && (
                      <ResultRow
                        label={`Section 87A Rebate (₹${result.rebate.toLocaleString("en-IN")})`}
                        value={result.rebate}
                        color="text-emerald-600"
                        prefix="−"
                      />
                    )}

                    <div className="h-px bg-gray-200" />
                    <ResultRow label="Tax After Rebate" value={result.taxAfterRebate} color="text-slate-900" />
                    {result.taxAfterRebate > 0 && (
                      <ResultRow label="Health & Education Cess (4%)" value={result.cess} color="text-rose-600" prefix="+" />
                    )}
                    <div className="h-px bg-gray-200" />
                    <ResultRow
                      label="Total Tax Payable"
                      value={result.totalTax}
                      color="text-emerald-600 font-bold"
                      className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-3 -mx-3"
                    />
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Charts Section ──────────────────────────────────────────────────────

function ChartsSection() {
  const [income, setIncome] = useState("1200000");
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [deductions, setDeductions] = useState<Deductions>({
    section80C: 150000,
    section80D: 25000,
    section80CCD1B: 50000,
    hra: 0,
    homeLoanInterest: 0,
  });
  const [showCharts, setShowCharts] = useState(false);

  const result = useMemo((): (IncomeTaxResult & { regime: TaxRegime }) | null => {
    const grossIncome = parseFloat(income);
    if (isNaN(grossIncome) || grossIncome <= 0) return null;

    const standardDeduction = regime === "new" ? 75000 : 50000;

    const otherDeductions = regime === "old"
      ? Math.min(deductions.section80C, 150000) +
        Math.min(deductions.section80D, 50000) +
        Math.min(deductions.section80CCD1B, 50000) +
        deductions.hra +
        Math.min(deductions.homeLoanInterest, 200000)
      : 0;

    const totalDeductions = standardDeduction + otherDeductions;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
    let taxBeforeRebate = 0;

    for (const slab of slabs) {
      const slabMin = slab.min;
      const slabMax = slab.max ?? Infinity;
      const slabIncome = Math.max(0, Math.min(taxableIncome, slabMax) - slabMin);
      taxBeforeRebate += slabIncome * (slab.rate / 100);
    }

    taxBeforeRebate = Math.round(taxBeforeRebate);

    const rebateLimit = regime === "new" ? 1200000 : 500000;
    const rebateMax = regime === "new" ? 60000 : 12500;
    let rebate = 0;
    if (taxableIncome <= rebateLimit) {
      rebate = Math.min(taxBeforeRebate, rebateMax);
    }
    rebate = Math.round(rebate);

    const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
    const cess = Math.round(taxAfterRebate * 0.04);
    const totalTax = taxAfterRebate + cess;

    return {
      grossIncome,
      standardDeduction,
      totalDeductions,
      taxableIncome,
      taxBeforeRebate,
      rebate,
      taxAfterRebate,
      cess,
      totalTax,
      effectiveRate: grossIncome > 0 ? parseFloat(((totalTax / grossIncome) * 100).toFixed(2)) : 0,
      currentIncome: grossIncome,
      regime,
      marginalRate: 0,
    };
  }, [income, regime, deductions]);

  return (
    <section className="py-10 sm:py-14 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Interactive Charts"
          title="Tax Visualizations"
          subtitle="Understand your tax liability at a glance with interactive charts and graphs."
          className="mb-8"
        />

        {/* Chart Controls */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 mb-8">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Turnover (₹)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tax Regime</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setRegime("new")}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    regime === "new"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setRegime("old")}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    regime === "old"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Old
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowCharts(true)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
              >
                <TrendingUp className="w-4 h-4 inline mr-1.5" />
                Generate Charts
              </button>
            </div>
          </div>
        </div>

        {showCharts && result && (
          <IncomeTaxCharts
            result={result}
            oldSlabs={OLD_SLABS}
            newSlabs={NEW_SLABS}
            oldStandardDeduction={50000}
            newStandardDeduction={75000}
            oldRebateLimit={500000}
            newRebateLimit={1200000}
            oldRebateMax={12500}
            newRebateMax={60000}
            deductions={regime === "old" ? deductions : undefined}
          />
        )}
      </div>
    </section>
  );
}

// ─── Tax Saving Dashboard Section ────────────────────────────────────────

function TaxSavingSection() {
  const [income, setIncome] = useState("1200000");
  const [regime, setRegime] = useState<TaxRegime>("new");
  const [deductions, setDeductions] = useState<Deductions>({
    section80C: 50000,
    section80D: 10000,
    section80CCD1B: 0,
    hra: 0,
    homeLoanInterest: 0,
  });
  const [showDashboard, setShowDashboard] = useState(false);

  const result = useMemo(() => {
    const grossIncome = parseFloat(income);
    if (isNaN(grossIncome)) return null;

    const standardDeduction = regime === "new" ? 75000 : 50000;
    const otherDeductions = regime === "old"
      ? Math.min(deductions.section80C, 150000) +
        Math.min(deductions.section80D, 50000) +
        Math.min(deductions.section80CCD1B, 50000) +
        deductions.hra +
        Math.min(deductions.homeLoanInterest, 200000)
      : 0;

    const totalDeductions = standardDeduction + otherDeductions;
    const taxableIncome = Math.max(0, grossIncome - totalDeductions);

    const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;
    let taxBeforeRebate = 0;

    for (const slab of slabs) {
      const slabMin = slab.min;
      const slabMax = slab.max ?? Infinity;
      const slabIncome = Math.max(0, Math.min(taxableIncome, slabMax) - slabMin);
      taxBeforeRebate += slabIncome * (slab.rate / 100);
    }

    taxBeforeRebate = Math.round(taxBeforeRebate);

    const rebateLimit = regime === "new" ? 1200000 : 500000;
    const rebateMax = regime === "new" ? 60000 : 12500;
    let rebate = 0;
    if (taxableIncome <= rebateLimit) {
      rebate = Math.min(taxBeforeRebate, rebateMax);
    }
    rebate = Math.round(rebate);

    const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate);
    const cess = Math.round(taxAfterRebate * 0.04);
    const totalTax = taxAfterRebate + cess;

    return {
      grossIncome,
      totalDeductions,
      taxableIncome,
      totalTax,
      effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
    };
  }, [income, regime, deductions]);

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Smart Suggestions"
          title="Tax Saving Opportunities"
          subtitle="Personalized recommendations and a what-if simulator to help you optimize your taxes."
          className="mb-8"
        />

        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 mb-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Monthly Turnover (₹)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tax Regime</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setRegime("new")}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    regime === "new"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setRegime("old")}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    regime === "old"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Old
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setShowDashboard(true)}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 inline mr-1.5" />
                Show Savings
              </button>
            </div>
          </div>

          {regime === "old" && (
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(deductions) as (keyof Deductions)[]).map((key) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-medium text-slate-500">{DEDUCTION_LABELS[key]}</label>
                    <span className="text-[10px] font-semibold text-emerald-600">₹{deductions[key].toLocaleString("en-IN")}</span>
                  </div>
                  <input
                    type="number"
                    value={deductions[key] || ""}
                    onChange={(e) =>
                      setDeductions((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {showDashboard && result && (
          <TaxSavingDashboard
            result={result}
            deductions={regime === "old" ? deductions : undefined}
            regime={regime}
          />
        )}
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
