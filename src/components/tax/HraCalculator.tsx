"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Home,
  Building2,
  MapPin,
  Calculator,
  Info,
  DollarSign,
  TrendingUp,
  PiggyBank,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface HraResult {
  basicDa: number;
  hraReceived: number;
  rentPaid: number;
  metroCity: boolean;
  actualHra: number;
  rentExcess: number;
  fiftyPercentBasic: number;
  hraExempt: number;
  taxableHra: number;
  monthlyTaxSaving: number;
  annualTaxSaving: number;
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function HraCalculator() {
  const [basicDa, setBasicDa] = useState("60000");
  const [hraReceived, setHraReceived] = useState("24000");
  const [monthlyRent, setMonthlyRent] = useState("18000");
  const [isMetro, setIsMetro] = useState(true);
  const [marginalRate, setMarginalRate] = useState(20);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo((): HraResult | null => {
    const basic = parseFloat(basicDa);
    const hra = parseFloat(hraReceived);
    const rent = parseFloat(monthlyRent);

    if (isNaN(basic) || isNaN(hra) || isNaN(rent) || basic <= 0 || hra <= 0 || rent <= 0) {
      return null;
    }

    // HRA exemption = least of 3:
    // 1. Actual HRA received
    // 2. Rent paid - 10% of basic salary
    // 3. 50% of basic (metro) or 40% of basic (non-metro)
    const actualHra = hra;
    const rentExcess = rent - 0.1 * basic;
    const fiftyPercentBasic = isMetro ? 0.5 * basic : 0.4 * basic;

    const hraExempt = Math.min(actualHra, Math.max(0, rentExcess), fiftyPercentBasic);
    const taxableHra = Math.max(0, hra - hraExempt);

    const monthlyTaxSaving = hraExempt * (marginalRate / 100);
    const annualTaxSaving = monthlyTaxSaving * 12;

    return {
      basicDa: basic,
      hraReceived: hra,
      rentPaid: rent,
      metroCity: isMetro,
      actualHra,
      rentExcess: Math.max(0, rentExcess),
      fiftyPercentBasic,
      hraExempt: Math.round(hraExempt),
      taxableHra: Math.round(taxableHra),
      monthlyTaxSaving: Math.round(monthlyTaxSaving),
      annualTaxSaving: Math.round(annualTaxSaving),
    };
  }, [basicDa, hraReceived, monthlyRent, isMetro, marginalRate]);

  const handleCalculate = () => setCalculated(true);

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-purple-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">HRA Exemption Calculator</h3>
            <p className="text-xs text-violet-200">Calculate your House Rent Allowance tax exemption</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div className="space-y-4">
            {/* Basic Salary (per month) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Basic Salary + DA (Monthly ₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={basicDa}
                  onChange={(e) => setBasicDa(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none text-lg font-medium"
                />
              </div>
            </div>

            {/* HRA Received */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                HRA Received (Monthly ₹)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={hraReceived}
                  onChange={(e) => setHraReceived(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none text-lg font-medium"
                />
              </div>
            </div>

            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Monthly Rent Paid (₹)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none text-lg font-medium"
                />
              </div>
            </div>

            {/* Metro Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-violet-600" />
                City Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsMetro(true)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isMetro
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🏙️ Metro City
                </button>
                <button
                  onClick={() => setIsMetro(false)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    !isMetro
                      ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  🏘️ Non-Metro
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {isMetro
                  ? "50% of Basic considered (Delhi, Mumbai, Chennai, Kolkata)"
                  : "40% of Basic considered (All other cities)"}
              </p>
            </div>

            {/* Marginal Tax Rate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                Your Marginal Tax Rate
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {[0, 5, 10, 15, 20, 30].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMarginalRate(rate)}
                    className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                      marginalRate === rate
                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md scale-105"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-600/20"
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              Calculate HRA Exemption
            </button>
          </div>

          {/* Results */}
          <div>
            {!calculated || !result ? (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div>
                  <Home className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Enter your salary & rent details</p>
                  <p className="text-xs text-slate-400 mt-1">Find out how much HRA is tax-free</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Exempt Amount Highlight */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 sm:p-5 border border-violet-100 text-center">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">HRA Exempt Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600 mt-1">
                    ₹{result.hraExempt.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">per month</p>
                </div>

                {/* Tax Savings */}
                {result.annualTaxSaving > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PiggyBank className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-800">Annual Tax Saving</span>
                      </div>
                      <span className="text-lg font-bold text-emerald-600">
                        ₹{result.annualTaxSaving.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-700/70 mt-1">
                      At {marginalRate}% marginal tax rate
                    </p>
                  </div>
                )}

                {/* Three-way comparison */}
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                    Least of 3 Rule — Comparison
                  </h4>
                  <div className="space-y-2.5">
                    <ComparisonRow
                      label="1. Actual HRA Received"
                      value={result.actualHra}
                      isMinimum={result.hraExempt === result.actualHra}
                    />
                    <ComparisonRow
                      label={`2. Rent paid − 10% of Basic (${(result.rentPaid - 0.1 * result.basicDa).toFixed(0)})`}
                      value={result.rentExcess}
                      isMinimum={result.hraExempt === Math.round(result.rentExcess)}
                    />
                    <ComparisonRow
                      label={`3. ${result.metroCity ? "50%" : "40%"} of Basic (${result.metroCity ? "50" : "40"}% of ₹${result.basicDa.toLocaleString("en-IN")})`}
                      value={result.fiftyPercentBasic}
                      isMinimum={result.hraExempt === Math.round(result.fiftyPercentBasic)}
                    />
                  </div>
                  <div className="border-t border-slate-100 mt-3 pt-3">
                    <div className="flex items-center justify-between text-sm font-bold text-violet-700">
                      <span>✅ HRA Exempt (Least of 3)</span>
                      <span>₹{result.hraExempt.toLocaleString("en-IN")}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">Breakdown</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">HRA Received</span>
                      <span className="font-semibold text-slate-800">₹{result.hraReceived.toLocaleString("en-IN")}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600 flex items-center gap-1">
                        <span>−</span> HRA Exempt
                      </span>
                      <span className="font-semibold text-green-600">₹{result.hraExempt.toLocaleString("en-IN")}/mo</span>
                    </div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taxable HRA</span>
                      <span className="font-semibold text-rose-600">₹{result.taxableHra.toLocaleString("en-IN")}/mo</span>
                    </div>
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3">
                  <Info className="w-3 h-3 mt-0.5 shrink-0" />
                  <p>
                    HRA exemption is only available under the <strong>Old Tax Regime</strong>.
                    If paying rent &gt; ₹1L/year, ensure your landlord's PAN is provided to avoid TDS u/s 194I.
                    This calculation assumes you live in rented accommodation.
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

// ─── Comparison Row ──────────────────────────────────────────────────────

function ComparisonRow({
  label,
  value,
  isMinimum,
}: {
  label: string;
  value: number;
  isMinimum: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between p-2.5 rounded-lg text-xs sm:text-sm ${
        isMinimum
          ? "bg-violet-50 border border-violet-200"
          : "bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2">
        {isMinimum && <span className="text-violet-600 text-xs">✓</span>}
        <span className={isMinimum ? "text-violet-700 font-medium" : "text-slate-600"}>
          {label}
        </span>
      </div>
      <span className={`font-semibold ${isMinimum ? "text-violet-700" : "text-slate-700"}`}>
        ₹{Math.round(value).toLocaleString("en-IN")}/mo
      </span>
    </motion.div>
  );
}
