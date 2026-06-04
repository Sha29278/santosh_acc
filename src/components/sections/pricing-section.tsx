"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/ui/section-title";
import Button from "@/components/ui/button";
import { pricingPlans } from "@/data/site-data";
import { Check, IndianRupee, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function PricingSection() {
  const { t } = useLanguage();
  const [income, setIncome] = useState("");

  const recommendedPlan = useMemo(() => {
    const amt = parseInt(income.replace(/,/g, ""));
    if (isNaN(amt) || amt <= 0) return null;
    // Find the plan where income falls within its range
    for (const plan of pricingPlans) {
      const min = plan.incomeMin ?? 0;
      const max = plan.incomeMax ?? Infinity;
      if (amt >= min && amt <= max) {
        return plan;
      }
    }
    return null;
  }, [income]);

  const formatIncome = (val: string) => {
    const raw = val.replace(/[^0-9]/g, "");
    if (!raw) return "";
    return Number(raw).toLocaleString("en-IN");
  };

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.pricing.badge}
          title={t.pricing.title}
          subtitle={t.pricing.subtitle}
        />

        {/* Income-based recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto mb-10"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 p-4 sm:p-6 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
              <IndianRupee className="w-4 h-4 text-blue-600" />
              {t.pricing.yourIncome}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={income ? formatIncome(income) : income}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, "");
                  setIncome(raw);
                }}
                placeholder={t.pricing.enterIncome}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 bg-white/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            {recommendedPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 flex items-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-600">
                  {t.pricing.recommended}{" "}
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    {recommendedPlan.name}
                  </span>{" "}
                  plan for you
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const isRecommended = recommendedPlan?.name === plan.name;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-[2px] ${isRecommended ? "bg-gradient-to-br from-blue-600 via-indigo-500 to-sky-500" : plan.recommended && !recommendedPlan ? "bg-gradient-to-br from-blue-600 via-indigo-500 to-sky-500" : ""}`}
              >
                <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 h-full ${isRecommended || (plan.recommended && !recommendedPlan) ? "" : "border border-gray-200 hover:border-indigo-200"} transition-colors relative`}>
                  {/* Default badge */}
                  {plan.recommended && !recommendedPlan && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap">
                      {t.pricing.mostPopular}
                    </span>
                  )}
                  {/* Income-based badge */}
                  {isRecommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg whitespace-nowrap">
                      ✨ Recommended for You
                    </span>
                  )}

                  <h3 className={`text-xl font-bold mb-2 ${isRecommended ? "gradient-text" : plan.recommended ? "gradient-text" : "text-slate-900"}`}>{plan.name}</h3>
                  <p className="text-sm text-slate-600 mb-6">{plan.description}</p>

                  {/* Income eligibility tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-xs font-medium text-blue-700 mb-4">
                    <IndianRupee className="w-3 h-3" />
                    {plan.incomeTag}
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      ₹{plan.price}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">
                      /{plan.period}
                    </span>
                  </div>

                  <Link href="/contact">
                    <Button
                      variant={isRecommended ? "rainbow" : plan.recommended ? "rainbow" : "outline"}
                      className="w-full"
                    >
                      {t.pricing.getStarted}
                    </Button>
                  </Link>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
