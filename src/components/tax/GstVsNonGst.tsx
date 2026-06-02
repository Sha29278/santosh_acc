"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  BadgePercent,
  DollarSign,
  ShoppingBag,
  TrendingDown,
  PiggyBank,
  Calculator,
  Info,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

interface ComparisonResult {
  originalPrice: number;
  gstRate: number;
  priceWithGst: number;
  gstAmount: number;
  nonGstPrice: number;
  nonGstSaving: number;
  savingPercent: number;
}

// ─── Items Database ──────────────────────────────────────────────────────

const PRODUCT_CATEGORIES = [
  {
    name: "Grocery & Essentials",
    items: [
      { name: "Wheat / Rice (loose)", rate: 0, emoji: "🌾" },
      { name: "Fresh Vegetables", rate: 0, emoji: "🥦" },
      { name: "Milk (Packed)", rate: 0, emoji: "🥛" },
      { name: "Eggs", rate: 0, emoji: "🥚" },
      { name: "Bread", rate: 0, emoji: "🍞" },
      { name: "Salt & Spices (unbranded)", rate: 0, emoji: "🧂" },
    ],
  },
  {
    name: "Packaged Food & Beverages",
    items: [
      { name: "Packaged Wheat Flour (Atta)", rate: 5, emoji: "🫓" },
      { name: "Packaged Curd / Yogurt", rate: 5, emoji: "🥛" },
      { name: "Tea (Packaged)", rate: 5, emoji: "🍵" },
      { name: "Coffee (Packaged)", rate: 5, emoji: "☕" },
      { name: "Biscuits", rate: 5, emoji: "🍪" },
      { name: "Baby Food", rate: 5, emoji: "🍼" },
    ],
  },
  {
    name: "Consumer Goods & Services",
    items: [
      { name: "Computer / Laptop", rate: 18, emoji: "💻" },
      { name: "Mobile Phone", rate: 18, emoji: "📱" },
      { name: "TV / Refrigerator / AC", rate: 18, emoji: "📺" },
      { name: "Software", rate: 18, emoji: "💿" },
      { name: "Restaurant Bill (Non-AC)", rate: 5, emoji: "🍽️" },
      { name: "Restaurant Bill (AC)", rate: 18, emoji: "🍽️" },
    ],
  },
  {
    name: "Luxury & Sin Goods",
    items: [
      { name: "Luxury Car", rate: 28, emoji: "🚗" },
      { name: "Motorcycle (>350cc)", rate: 28, emoji: "🏍️" },
      { name: "Cigarettes", rate: 28, emoji: "🚬" },
      { name: "Alcohol (varies by state)", rate: 28, emoji: "🍺" },
      { name: "Aerated Drinks (Soda)", rate: 28, emoji: "🥤" },
      { name: "Pan Masala", rate: 28, emoji: "🟢" },
    ],
  },
  {
    name: "Services",
    items: [
      { name: "Hotel Room (<₹1K)", rate: 0, emoji: "🏨" },
      { name: "Hotel Room (₹1K–₹7.5K)", rate: 12, emoji: "🏨" },
      { name: "Hotel Room (>₹7.5K)", rate: 18, emoji: "🏨" },
      { name: "Air Travel (Economy)", rate: 5, emoji: "✈️" },
      { name: "Insurance Premium", rate: 18, emoji: "🛡️" },
      { name: "Gym / Fitness Center", rate: 18, emoji: "💪" },
    ],
  },
];

const GST_RATES = [0, 5, 12, 18, 28];

// ─── Main Component ──────────────────────────────────────────────────────

export default function GstVsNonGst() {
  const [price, setPrice] = useState("10000");
  const [gstRate, setGstRate] = useState(18);
  const [showItems, setShowItems] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const result = useMemo((): ComparisonResult | null => {
    const p = parseFloat(price);
    if (isNaN(p) || p <= 0) return null;

    const priceWithGst = p * (1 + gstRate / 100);
    const gstAmount = p * (gstRate / 100);
    const nonGstPrice = p;
    const nonGstSaving = gstAmount;
    const savingPercent = (nonGstSaving / priceWithGst) * 100;

    return {
      originalPrice: p,
      gstRate,
      priceWithGst: Math.round(priceWithGst * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      nonGstPrice: p,
      nonGstSaving: Math.round(gstAmount * 100) / 100,
      savingPercent: Math.round(savingPercent * 100) / 100,
    };
  }, [price, gstRate]);

  const category = PRODUCT_CATEGORIES[selectedCategory];

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-amber-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <BadgePercent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">GST vs Non-GST Price Comparison</h3>
            <p className="text-xs text-amber-200">See how much more you pay with GST on different items</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Inputs + Item Browser */}
          <div className="space-y-4">
            {/* Quick Item Browser */}
            <div>
              <button
                onClick={() => setShowItems(!showItems)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                Browse Items by Category
                <span className="text-xs text-slate-400 ml-auto">{showItems ? "▼" : "▶"}</span>
              </button>

              {showItems && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2 mb-4"
                >
                  {/* Category tabs */}
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                    {PRODUCT_CATEGORIES.map((cat, idx) => (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(idx)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                          selectedCategory === idx
                            ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Items grid */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {category.items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          setPrice(String(item.rate === 0 ? 1000 : 5000));
                          setGstRate(item.rate);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs transition-all ${
                          gstRate === item.rate
                            ? "border-amber-300 bg-amber-50"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span>{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-slate-700">{item.name}</p>
                          <span className={`text-[10px] font-semibold ${
                            item.rate === 0
                              ? "text-emerald-600"
                              : item.rate === 28
                                ? "text-rose-600"
                                : "text-amber-600"
                          }`}>
                            {item.rate}% GST
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Manual Price Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Base Price (Without GST ₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-lg font-medium"
                />
              </div>
            </div>

            {/* GST Rate Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4 text-amber-600" />
                GST Rate
              </label>
              <div className="grid grid-cols-5 gap-2">
                {GST_RATES.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setGstRate(rate)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      gstRate === rate
                        ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg scale-105"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison card at small screen */}
            {result && (
              <div className="lg:hidden">
                <ComparisonCard result={result} />
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="hidden lg:block">
            {!result ? (
              <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div>
                  <BadgePercent className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Enter a price to compare</p>
                  <p className="text-xs text-slate-400 mt-1">See how GST impacts the final price</p>
                </div>
              </div>
            ) : (
              <ComparisonCard result={result} />
            )}
          </div>
        </div>

        {/* Mobile results */}
        {result && (
          <div className="mt-4 lg:hidden">
            <ComparisonCard result={result} />
          </div>
        )}

        {/* GST Rate Impact Table */}
        {result && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              How GST Rate Affects ₹{result.originalPrice.toLocaleString("en-IN")}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">GST Rate</th>
                    {GST_RATES.map((rate) => (
                      <th key={rate} className={`text-right py-2 px-3 font-semibold ${
                        rate === gstRate ? "text-amber-600" : "text-slate-500"
                      }`}>
                        {rate}%
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3 font-medium text-slate-600">GST Amount</td>
                    {GST_RATES.map((rate) => (
                      <td key={rate} className={`text-right py-2 px-3 font-medium ${
                        rate === gstRate ? "text-amber-600" : "text-slate-500"
                      }`}>
                        ₹{Math.round(result.originalPrice * rate / 100).toLocaleString("en-IN")}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium text-slate-600">Total with GST</td>
                    {GST_RATES.map((rate) => (
                      <td key={rate} className={`text-right py-2 px-3 font-bold ${
                        rate === gstRate
                          ? "text-amber-600 bg-amber-50 rounded-lg"
                          : "text-slate-600"
                      }`}>
                        ₹{Math.round(result.originalPrice * (1 + rate / 100)).toLocaleString("en-IN")}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info note */}
        <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 bg-slate-50 rounded-xl p-3">
          <Info className="w-3 h-3 mt-0.5 shrink-0" />
          <p>
            This comparison shows the GST component of the price. Items with 0% GST include basic 
            necessities (unprocessed food, milk, eggs). Luxury and sin goods attract 28% GST. 
            Restaurant bills with AC attract 18% GST vs 5% for non-AC. Some items may have 
            additional state-specific cess or surcharges.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Comparison Card ─────────────────────────────────────────────────────

function ComparisonCard({ result }: { result: ComparisonResult }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-4">Price Comparison</h4>

      <div className="space-y-4">
        {/* Savings Highlight */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100 text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">You Pay Extra in GST</p>
          <p className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mt-1">
            ₹{result.gstAmount.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {result.savingPercent.toFixed(1)}% of the final price is GST
          </p>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Without GST</p>
            <p className="text-xl font-bold text-slate-700">₹{result.originalPrice.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-slate-400">Base price</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-center">
            <p className="text-[10px] text-amber-600 font-medium uppercase tracking-wider mb-1">With {result.gstRate}% GST</p>
            <p className="text-xl font-bold text-amber-700">₹{result.priceWithGst.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-amber-500">Final price</p>
          </div>
        </div>

        {/* Price breakdown bar */}
        <div className="w-full h-10 rounded-xl overflow-hidden flex shadow-sm">
          <div
            className="h-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              width: `${100 - result.savingPercent}%`,
              background: "linear-gradient(135deg, #64748B, #475569)",
            }}
          >
            ₹{result.originalPrice.toLocaleString("en-IN")}
          </div>
          <div
            className="h-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              width: `${result.savingPercent}%`,
              background: "linear-gradient(135deg, #F59E0B, #F97316)",
            }}
          >
            GST ₹{result.gstAmount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Detail rows */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Base Price</span>
            <span className="font-semibold text-slate-700">₹{result.originalPrice.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-600 flex items-center gap-1">
              <BadgePercent className="w-3 h-3" />
              GST @ {result.gstRate}%
            </span>
            <span className="font-semibold text-amber-600">+ ₹{result.gstAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="h-px bg-slate-200" />
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Final Price</span>
            <span className="font-bold text-slate-800">₹{result.priceWithGst.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
