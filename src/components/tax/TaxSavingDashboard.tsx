"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  PiggyBank,
  TrendingUp,
  Shield,
  Heart,
  GraduationCap,
  Home,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Calculator,
  RefreshCw,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface Deductions {
  section80C: number;
  section80D: number;
  section80CCD1B: number;
  hra: number;
  homeLoanInterest: number;
}

interface TaxResult {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  totalDeductions: number;
}

interface TaxSavingDashboardProps {
  result: TaxResult;
  deductions: Deductions | undefined;
  regime: "old" | "new";
}

interface SavingRecommendation {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  potentialSaving: number;
  color: string;
  section?: string;
  link?: string;
}

// ─── Recommendation Engine ───────────────────────────────────────────────

function generateRecommendations(
  income: number,
  tax: number,
  deductions: Deductions | undefined,
  regime: "old" | "new"
): SavingRecommendation[] {
  const recs: SavingRecommendation[] = [];

  if (regime === "old" && deductions) {
    // 80C underutilized
    const used80C = deductions.section80C;
    const max80C = 150000;
    if (used80C < max80C) {
      const gap = max80C - used80C;
      recs.push({
        id: "80c",
        icon: <Shield className="w-5 h-5" />,
        title: "Maximize Section 80C Investments",
        description: `You're using ₹${(used80C / 1000).toFixed(0)}K of ₹1.5L limit. Invest ₹${(gap / 1000).toFixed(0)}K more in PPF, ELSS, or LIC to save more.`,
        potentialSaving: Math.round(gap * 0.3),
        color: "from-blue-600 to-indigo-600",
        section: "80C",
      });
    }

    // 80D underutilized
    const used80D = deductions.section80D;
    const max80D = 50000;
    if (used80D < max80D) {
      const gap = max80D - used80D;
      recs.push({
        id: "80d",
        icon: <Heart className="w-5 h-5" />,
        title: "Increase Health Insurance (Sec 80D)",
        description: `You can claim up to ₹50K for health insurance premiums. Add ₹${(gap / 1000).toFixed(0)}K more coverage.`,
        potentialSaving: Math.round(gap * 0.2),
        color: "from-rose-500 to-pink-500",
        section: "80D",
      });
    }

    // NPS additional (80CCD(1B))
    const usedNps = deductions.section80CCD1B;
    const maxNps = 50000;
    if (usedNps < maxNps) {
      const gap = maxNps - usedNps;
      recs.push({
        id: "nps",
        icon: <GraduationCap className="w-5 h-5" />,
        title: "Boost NPS Contribution (Sec 80CCD(1B))",
        description: `Additional NPS deduction of ₹50K available. You're using ₹${(usedNps / 1000).toFixed(0)}K. Add ₹${(gap / 1000).toFixed(0)}K to your NPS.`,
        potentialSaving: Math.round(gap * 0.3),
        color: "from-amber-500 to-orange-500",
        section: "80CCD(1B)",
      });
    }

    // HRA
    if (deductions.hra === 0 && income > 300000) {
      recs.push({
        id: "hra",
        icon: <Home className="w-5 h-5" />,
        title: "Claim HRA Exemption",
        description: "You haven't claimed any HRA. If you live on rent, you could save significantly on taxes.",
        potentialSaving: Math.round(income * 0.1 * 0.3),
        color: "from-emerald-500 to-teal-500",
        section: "HRA",
      });
    }

    // Home loan interest
    if (deductions.homeLoanInterest === 0 && income > 500000) {
      recs.push({
        id: "home-loan",
        icon: <Home className="w-5 h-5" />,
        title: "Consider Home Loan Benefits (Sec 24)",
        description: "Home loan interest up to ₹2L is deductible. Even if you don't have one, planning a purchase can save tax.",
        potentialSaving: Math.round(200000 * 0.3),
        color: "from-purple-500 to-violet-500",
        section: "24(b)",
      });
    }
  }

  // Regime-switch recommendation
  if (regime === "old" && income <= 1200000) {
    recs.push({
      id: "switch-new",
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Check New Tax Regime",
      description: `With income of ₹${(income / 100000).toFixed(1)}L, the new regime offers tax-free income up to ₹12L (with rebate). You might pay zero tax!`,
      potentialSaving: Math.round(tax * 0.8),
      color: "from-cyan-500 to-blue-500",
    });
  }

  if (regime === "new" && deductions) {
    const totalDeductions =
      Math.min(deductions.section80C, 150000) +
      Math.min(deductions.section80D, 50000) +
      Math.min(deductions.section80CCD1B, 50000);
    if (totalDeductions > 150000) {
      recs.push({
        id: "switch-old",
        icon: <ArrowRight className="w-5 h-5" />,
        title: "Consider Old Tax Regime",
        description: `You have ₹${(totalDeductions / 1000).toFixed(0)}K in deductions. The old regime might save you more tax. Try switching!`,
        potentialSaving: Math.round(totalDeductions * 0.2),
        color: "from-indigo-500 to-blue-500",
      });
    }
  }

  // General tip
  if (regime === "new") {
    recs.push({
      id: "standard-deduction",
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Standard Deduction Already Applied",
      description: "₹75,000 standard deduction is automatically deducted under the new regime. No other deductions are allowed.",
      potentialSaving: 0,
      color: "from-blue-500 to-indigo-500",
    });
  }

  return recs.sort((a, b) => b.potentialSaving - a.potentialSaving);
}

// ─── What-If Slider ──────────────────────────────────────────────────────

interface SliderOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  current: number;
  max: number;
  min?: number;
  step?: number;
  unit?: string;
}

function WhatIfSlider({
  option,
  value,
  onChange,
}: {
  option: SliderOption;
  value: number;
  onChange: (v: number) => void;
}) {
  const percentage = ((value - (option.min || 0)) / (option.max - (option.min || 0))) * 100;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 hover:border-blue-200 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-600">{option.icon}</span>
          <span className="text-sm font-medium text-slate-700">{option.label}</span>
        </div>
        <span className="text-sm font-semibold text-blue-600">
          ₹{(value / 1000).toFixed(0)}K
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={option.min || 0}
          max={option.max}
          step={option.step || 5000}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0"
          style={{
            background: `linear-gradient(to right, #3B82F6 ${percentage}%, #E2E8F0 ${percentage}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹{(option.min || 0).toLocaleString("en-IN")}</span>
          <span className="text-blue-500">Max ₹{(option.max).toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function TaxSavingDashboard({
  result,
  deductions,
  regime,
}: TaxSavingDashboardProps) {
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [sliderValues, setSliderValues] = useState({
    section80C: deductions?.section80C || 0,
    section80D: deductions?.section80D || 0,
    section80CCD1B: deductions?.section80CCD1B || 0,
    hra: deductions?.hra || 0,
    homeLoanInterest: deductions?.homeLoanInterest || 0,
  });

  const recommendations = useMemo(
    () => generateRecommendations(result.grossIncome, result.totalTax, deductions, regime),
    [result.grossIncome, result.totalTax, deductions, regime]
  );

  // Calculate potential savings from what-if
  const whatIfTax = useMemo(() => {
    if (regime !== "old") return 0;

    const totalDeductions =
      Math.min(sliderValues.section80C, 150000) +
      Math.min(sliderValues.section80D, 50000) +
      Math.min(sliderValues.section80CCD1B, 50000) +
      sliderValues.hra +
      Math.min(sliderValues.homeLoanInterest, 200000) +
      50000; // standard deduction

    const taxableIncome = Math.max(0, result.grossIncome - totalDeductions);
    // Simplified tax calc (using old regime slabs)
    let tax = 0;
    if (taxableIncome > 250000) {
      const slabs = [
        { min: 250001, max: 500000, rate: 0.05 },
        { min: 500001, max: 1000000, rate: 0.2 },
        { min: 1000001, max: Infinity, rate: 0.3 },
      ];
      for (const slab of slabs) {
        const slabIncome = Math.max(0, Math.min(taxableIncome, slab.max) - slab.min);
        tax += slabIncome * slab.rate;
      }
    }
    if (taxableIncome <= 500000) {
      tax = Math.max(0, tax - 12500);
    }
    const cess = Math.round(tax * 0.04);
    return Math.round(tax + cess);
  }, [sliderValues, result.grossIncome, regime]);

  const currentTax = result.totalTax;
  const whatIfSavings = Math.max(0, currentTax - whatIfTax);

  // Slider options
  const sliderOptions: SliderOption[] = [
    {
      id: "section80C",
      label: "Section 80C (PPF, ELSS, LIC)",
      icon: <Shield className="w-4 h-4" />,
      current: sliderValues.section80C,
      max: 150000,
      step: 5000,
    },
    {
      id: "section80D",
      label: "Section 80D (Health Insurance)",
      icon: <Heart className="w-4 h-4" />,
      current: sliderValues.section80D,
      max: 50000,
      step: 5000,
    },
    {
      id: "section80CCD1B",
      label: "NPS Additional (80CCD(1B))",
      icon: <GraduationCap className="w-4 h-4" />,
      current: sliderValues.section80CCD1B,
      max: 50000,
      step: 5000,
    },
    {
      id: "hra",
      label: "HRA Exemption",
      icon: <Home className="w-4 h-4" />,
      current: sliderValues.hra,
      max: 500000,
      step: 10000,
    },
    {
      id: "homeLoanInterest",
      label: "Home Loan Interest (Sec 24)",
      icon: <Home className="w-4 h-4" />,
      current: sliderValues.homeLoanInterest,
      max: 200000,
      step: 10000,
    },
  ];

  const updateSlider = (id: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [id]: value }));
  };

  const actionableRecs = recommendations.filter((r) => r.potentialSaving > 0);
  const infoRecs = recommendations.filter((r) => r.potentialSaving === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-2xl p-6 sm:p-8 border border-emerald-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Your Tax Saving Opportunities
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Personalized recommendations based on your income and deductions profile
            </p>
          </div>
        </div>

        {/* Savings summary */}
        {actionableRecs.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-emerald-100 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total Potential</p>
              <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                ₹{actionableRecs.reduce((s, r) => s + r.potentialSaving, 0).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-slate-400">in tax savings</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-blue-100 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Current Tax</p>
              <p className="text-lg font-bold text-blue-600">
                ₹{currentTax.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-slate-400">payable</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-amber-100 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Effective Rate</p>
              <p className="text-lg font-bold text-amber-600">{result.effectiveRate.toFixed(1)}%</p>
              <p className="text-[10px] text-slate-400">of income</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-purple-100 text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Optimizations</p>
              <p className="text-lg font-bold text-purple-600">{actionableRecs.length}</p>
              <p className="text-[10px] text-slate-400">available</p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations list */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Recommended Actions
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {actionableRecs.map((rec, idx) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-4 relative overflow-hidden hover:shadow-md transition-all h-full">
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${rec.color}`} />
                <div className="flex items-start gap-3 pl-2">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${rec.color} flex items-center justify-center shrink-0 shadow-md`}>
                    {rec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-semibold text-slate-900">{rec.title}</h5>
                      {rec.potentialSaving > 0 && (
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 whitespace-nowrap">
                          Save ₹{rec.potentialSaving.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{rec.description}</p>
                    {rec.section && (
                      <span className="inline-block mt-1.5 text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        Section {rec.section}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {infoRecs.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            {infoRecs.map((rec, idx) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-4 bg-blue-50/50 border-blue-100 hover:shadow-md transition-all h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{rec.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{rec.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {actionableRecs.length === 0 && infoRecs.length === 0 && (
          <Card className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">You're already optimized! 🎉</p>
            <p className="text-xs text-slate-400 mt-1">
              No additional tax saving opportunities found for your current profile.
            </p>
          </Card>
        )}
      </div>

      {/* What-if Simulator */}
      {regime === "old" && deductions && (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
          <button
            onClick={() => setShowWhatIf(!showWhatIf)}
            className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  What-If Simulator 🎯
                </h4>
                <p className="text-xs text-slate-500">
                  Drag sliders to see how adjusting deductions affects your tax
                </p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center transition-transform ${showWhatIf ? "rotate-180" : ""}`}>
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <AnimatePresence>
            {showWhatIf && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="px-4 sm:px-6 pb-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {sliderOptions.map((opt) => (
                      <WhatIfSlider
                        key={opt.id}
                        option={opt}
                        value={sliderValues[opt.id as keyof typeof sliderValues]}
                        onChange={(v) => updateSlider(opt.id, v)}
                      />
                    ))}
                  </div>

                  {/* Result summary */}
                  <div className="bg-white rounded-xl p-4 border border-blue-100">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Current Tax</p>
                        <p className="text-lg font-bold text-slate-700">
                          ₹{currentTax.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Optimized Tax</p>
                        <p className="text-lg font-bold text-emerald-600">
                          ₹{whatIfTax.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="sm:col-span-2 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
                        <p className="text-[10px] text-slate-500 uppercase">Potential Savings</p>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                          ₹{whatIfSavings.toLocaleString("en-IN")}
                        </p>
                        {whatIfSavings > 0 && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                            <TrendingUp className="w-3 h-3" />
                            <span>
                              {currentTax > 0 ? ((whatIfSavings / currentTax) * 100).toFixed(0) : 0}% reduction
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Savings meter */}
                    {currentTax > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Tax reduction progress</span>
                          <span className="font-semibold text-emerald-600">
                            {((whatIfSavings / currentTax) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((whatIfSavings / currentTax) * 100, 100)}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
