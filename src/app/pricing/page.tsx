"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PricingSection from "@/components/sections/pricing-section";
import { Check, X, Sparkles, ArrowRight, Star, Shield, Headphones } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const comparisonData = [
  { feature: "GST Registration Assistance", starter: true, basic: true, pro: true, enterprise: true },
  { feature: "GSTR-3B Filing (Monthly)", starter: true, basic: true, pro: true, enterprise: true },
  { feature: "GSTR-1 Filing", starter: false, basic: true, pro: true, enterprise: true },
  { feature: "Income Tax Return Filing", starter: false, basic: true, pro: true, enterprise: true },
  { feature: "TDS Return Filing", starter: false, basic: true, pro: true, enterprise: true },
  { feature: "Accounting Support", starter: false, basic: true, pro: true, enterprise: true },
  { feature: "ROC Compliance", starter: false, basic: false, pro: true, enterprise: true },
  { feature: "Payroll Processing", starter: false, basic: false, pro: true, enterprise: true },
  { feature: "Audit Support", starter: false, basic: false, pro: false, enterprise: true },
  { feature: "Dedicated Account Manager", starter: false, basic: false, pro: true, enterprise: true },
  { feature: "Email Support", starter: true, basic: true, pro: true, enterprise: true },
  { feature: "Phone Support", starter: false, basic: true, pro: true, enterprise: true },
  { feature: "24/7 Priority Support", starter: false, basic: false, pro: true, enterprise: true },
  { feature: "Dedicated CA Support", starter: false, basic: false, pro: false, enterprise: true },
  { feature: "Monthly Reports", starter: false, basic: false, pro: true, enterprise: true },
];

const features = [
  { icon: Shield, title: "Money-Back Guarantee", desc: "Not satisfied? Get a full refund within 30 days." },
  { icon: Star, title: "Top-Rated Service", desc: "4.9/5 average rating from 5000+ happy clients." },
  { icon: Headphones, title: "Dedicated Support", desc: "Personal account manager for enterprise plans." },
];

export default function PricingPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-20">
      <PricingSection />

      {/* Comparison Table */}
      <section className="py-16 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/60 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-48 h-48 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-200/40 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-sm font-medium text-blue-700 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                {t.pricing.comparePlans}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">{t.pricing.comparePlans}</h2>
              <p className="text-slate-500 mt-2">{t.pricing.compareSubtitle}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-blue-100 bg-white shadow-lg shadow-blue-600/5">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80">
                    <th className="text-left py-5 px-4 sm:px-6 font-semibold text-slate-900 text-sm">Feature</th>
                    <th className="text-center py-5 px-2 sm:px-4 font-semibold text-sm text-slate-500">Starter<br/><span className="text-[10px] font-normal">₹999/mo</span></th>
                    <th className="text-center py-5 px-2 sm:px-4 font-semibold text-sm text-slate-600">Basic<br/><span className="text-[10px] font-normal">₹2,499/mo</span></th>
                    <th className="text-center py-5 px-2 sm:px-4 font-semibold text-sm bg-gradient-to-b from-blue-100/80 to-indigo-100/80 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional<br/><span className="text-[10px] font-normal">₹4,999/mo</span></th>
                    <th className="text-center py-5 px-2 sm:px-4 font-semibold text-sm text-slate-500">Enterprise<br/><span className="text-[10px] font-normal">₹6,999/mo</span></th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={row.feature} className={`${i % 2 === 0 ? "bg-gradient-to-r from-blue-50/30 to-indigo-50/30" : ""} hover:bg-gradient-to-r hover:from-blue-100/40 hover:to-indigo-100/40 transition-colors`}>
                      <td className="py-3.5 px-4 sm:px-6 text-sm text-slate-700">{row.feature}</td>
                      <td className="text-center py-3.5 px-2 sm:px-4">
                        {row.starter ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                      </td>
                      <td className="text-center py-3.5 px-2 sm:px-4">
                        {row.basic ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                      </td>
                      <td className="text-center py-3.5 px-4 bg-gradient-to-b from-blue-50/50 to-indigo-50/50">
                        {row.pro ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                      </td>
                      <td className="text-center py-3.5 px-4">
                        {row.enterprise ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              const gradients = [
                "from-blue-600 to-indigo-600",
                "from-indigo-500 to-blue-600",
                "from-sky-500 to-blue-600",
              ];
              const bgGradients = [
                "from-blue-100 to-indigo-100",
                "from-indigo-100 to-blue-100",
                "from-sky-100 to-blue-100",
              ];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl" />
                  <div className="relative text-center p-6 rounded-2xl border border-white/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-slate-500">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.pricing.customPlan}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.pricing.customPlan}</h2>
            <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
              {t.pricing.customSubtitle}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25 text-lg"
            >
              {t.pricing.contactTeam}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
