"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  Briefcase,
  Home,
  PiggyBank,
  Landmark,
  Shield,
  TrendingUp,
  Calculator,
  Info,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface SalaryBreakup {
  component: string;
  amount: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
}

interface TakeHomeResult {
  ctc: number;
  basic: number;
  hra: number;
  employerPf: number;
  employerGratuity: number;
  professionalTax: number;
  standardDeduction: number;
  taxableIncome: number;
  totalTax: number;
  monthlyTakeHome: number;
  annualTakeHome: number;
  breakup: SalaryBreakup[];
  effectiveDeductionRate: number;
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function TakeHomeSalaryCalculator() {
  const [ctc, setCtc] = useState("1200000");
  const [basicPercent, setBasicPercent] = useState(50);
  const [hraPercent, setHraPercent] = useState(20);
  const [regime, setRegime] = useState<"old" | "new">("new");
  const [calculated, setCalculated] = useState(false);

  const result = useMemo((): TakeHomeResult | null => {
    const ctcNum = parseFloat(ctc);
    if (isNaN(ctcNum) || ctcNum <= 0) return null;

    const basic = Math.round(ctcNum * (basicPercent / 100));
    const hra = Math.round(basic * (hraPercent / 100));
    const employerPf = Math.round(Math.min(basic * 0.12, 1800 * 12)); // 12% of basic capped at ₹15K/month PF wage
    const employerGratuity = Math.round(basic * 0.0481); // 4.81% gratuity
    const professionalTax = 200 * 12; // ₹200/month (varies by state, using standard)

    // Total deductions from salary
    const totalSalaryDeductions = employerPf + professionalTax;

    // Tax calculation
    const standardDeduction = regime === "new" ? 75000 : 50000;
    let taxableIncome = ctcNum - standardDeduction;

    // Old regime: HRA is exempt (simplified: 50% of basic for metro)
    if (regime === "old") {
      const hraExempt = Math.min(hra, basic * 0.5);
      taxableIncome -= hraExempt;
      taxableIncome -= employerGratuity; // Sec 10(10)
    }

    taxableIncome = Math.max(0, taxableIncome);

    // Calculate tax
    let taxBeforeRebate = 0;

    if (regime === "new") {
      const slabs = [
        { min: 0, max: 400000, rate: 0 },
        { min: 400001, max: 800000, rate: 0.05 },
        { min: 800001, max: 1200000, rate: 0.1 },
        { min: 1200001, max: 1600000, rate: 0.15 },
        { min: 1600001, max: 2000000, rate: 0.2 },
        { min: 2000001, max: 2400000, rate: 0.25 },
        { min: 2400001, max: Infinity, rate: 0.3 },
      ];
      for (const slab of slabs) {
        const slabIncome = Math.max(0, Math.min(taxableIncome, slab.max) - slab.min);
        taxBeforeRebate += slabIncome * slab.rate;
      }
      // Rebate for new regime
      if (taxableIncome <= 1200000) {
        taxBeforeRebate = Math.max(0, taxBeforeRebate - 60000);
      }
    } else {
      const slabs = [
        { min: 0, max: 250000, rate: 0 },
        { min: 250001, max: 500000, rate: 0.05 },
        { min: 500001, max: 1000000, rate: 0.2 },
        { min: 1000001, max: Infinity, rate: 0.3 },
      ];
      for (const slab of slabs) {
        const slabIncome = Math.max(0, Math.min(taxableIncome, slab.max) - slab.min);
        taxBeforeRebate += slabIncome * slab.rate;
      }
      if (taxableIncome <= 500000) {
        taxBeforeRebate = Math.max(0, taxBeforeRebate - 12500);
      }
    }

    taxBeforeRebate = Math.round(taxBeforeRebate);
    const cess = Math.round(taxBeforeRebate * 0.04);
    const totalTax = taxBeforeRebate + cess;

    const annualDeductions = totalSalaryDeductions + totalTax;
    const annualTakeHome = ctcNum - annualDeductions;
    const monthlyTakeHome = Math.round(annualTakeHome / 12);
    const effectiveDeductionRate = ctcNum > 0 ? (annualDeductions / ctcNum) * 100 : 0;

    const breakup: SalaryBreakup[] = [
      {
        component: "Annual Take-Home",
        amount: annualTakeHome,
        percentage: (annualTakeHome / ctcNum) * 100,
        color: "from-emerald-500 to-teal-500",
        icon: <PiggyBank className="w-4 h-4" />,
      },
      {
        component: "Income Tax & Cess",
        amount: totalTax,
        percentage: (totalTax / ctcNum) * 100,
        color: "from-rose-500 to-red-500",
        icon: <Landmark className="w-4 h-4" />,
      },
      {
        component: "Employee PF",
        amount: employerPf,
        percentage: (employerPf / ctcNum) * 100,
        color: "from-blue-500 to-indigo-500",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        component: "Professional Tax",
        amount: professionalTax,
        percentage: (professionalTax / ctcNum) * 100,
        color: "from-amber-500 to-orange-500",
        icon: <Calculator className="w-4 h-4" />,
      },
    ];

    if (regime === "old") {
      breakup.push({
        component: "Gratuity",
        amount: employerGratuity,
        percentage: (employerGratuity / ctcNum) * 100,
        color: "from-purple-500 to-violet-500",
        icon: <Briefcase className="w-4 h-4" />,
      });
    }

    return {
      ctc: ctcNum,
      basic,
      hra,
      employerPf,
      employerGratuity,
      professionalTax,
      standardDeduction,
      taxableIncome,
      totalTax,
      monthlyTakeHome,
      annualTakeHome,
      breakup,
      effectiveDeductionRate,
    };
  }, [ctc, basicPercent, hraPercent, regime]);

  const handleCalculate = () => setCalculated(true);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Take-Home Salary Calculator</h3>
            <p className="text-xs text-blue-200">See exactly how much of your CTC lands in your bank account</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-5">
            {/* CTC Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Annual CTC (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg font-medium"
                />
              </div>
            </div>

            {/* Salary Structure Sliders */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">Basic Salary</label>
                <span className="text-sm font-semibold text-blue-600">{basicPercent}%</span>
              </div>
              <input
                type="range"
                min={30}
                max={60}
                value={basicPercent}
                onChange={(e) => setBasicPercent(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #3B82F6 ${((basicPercent - 30) / 30) * 100}%, #E2E8F0 ${((basicPercent - 30) / 30) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>30%</span>
                <span>60%</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">HRA (% of Basic)</label>
                <span className="text-sm font-semibold text-blue-600">{hraPercent}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                value={hraPercent}
                onChange={(e) => setHraPercent(parseInt(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-indigo-600 [&::-moz-range-thumb]:border-0"
                style={{
                  background: `linear-gradient(to right, #6366F1 ${((hraPercent - 10) / 40) * 100}%, #E2E8F0 ${((hraPercent - 10) / 40) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>10%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Regime Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tax Regime</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRegime("new")}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    regime === "new"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  New Regime
                </button>
                <button
                  onClick={() => setRegime("old")}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    regime === "old"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Old Regime
                </button>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/20"
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Calculate Take-Home
            </button>
          </div>

          {/* Results */}
          <div>
            {!calculated || !result ? (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div>
                  <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Enter your CTC & click calculate</p>
                  <p className="text-xs text-slate-400 mt-1">See a detailed breakup of your salary</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Monthly Take-Home Highlight */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-5 border border-emerald-100 text-center">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Monthly Take-Home</p>
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mt-1">
                    ₹{result.monthlyTakeHome.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Annual: ₹{result.annualTakeHome.toLocaleString("en-IN")} of ₹{result.ctc.toLocaleString("en-IN")} CTC
                  </p>
                </div>

                {/* Breakup Visualization */}
                <div className="space-y-2">
                  {result.breakup.map((item, idx) => (
                    <motion.div
                      key={item.component}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                            {item.icon}
                          </div>
                          <span className="font-medium text-slate-700">{item.component}</span>
                        </div>
                        <span className="font-semibold text-slate-800">
                          ₹{item.amount.toLocaleString("en-IN")}
                          <span className="text-[10px] text-slate-400 ml-1">({item.percentage.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Salary Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">Basic Salary</span>
                      <p className="font-semibold text-slate-800">₹{result.basic.toLocaleString("en-IN")}/yr</p>
                    </div>
                    <div>
                      <span className="text-slate-500">HRA</span>
                      <p className="font-semibold text-slate-800">₹{result.hra.toLocaleString("en-IN")}/yr</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Employer PF</span>
                      <p className="font-semibold text-slate-800">₹{result.employerPf.toLocaleString("en-IN")}/yr</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Tax Paid</span>
                      <p className="font-semibold text-rose-600">₹{result.totalTax.toLocaleString("en-IN")}/yr</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500">Effective Deduction Rate</span>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{result.effectiveDeductionRate.toFixed(1)}%</p>
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
                            style={{ width: `${Math.min(result.effectiveDeductionRate * 3, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  <p>
                    Calculations are estimates. Actual values depend on your company's salary structure, 
                    PF wage limit (₹15K/month), state professional tax, and specific HRA exemptions claimed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
