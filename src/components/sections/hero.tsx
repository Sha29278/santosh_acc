"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/button";
import { ArrowRight, Phone, Shield, FileText, TrendingUp, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen flex items-start lg:items-center overflow-hidden gradient-hero">
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Colorful glowing orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pulse-glow" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pulse-glow" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pulse-glow" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Rainbow accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 animated-gradient" />          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 lg:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-3 sm:mb-6"
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <span className="text-xs sm:text-sm font-medium text-white/90">{t.hero.trustBadge}</span>
            </motion.div>

            <h1 className="text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white leading-tight">
              {t.hero.title}{" "}
              <span className="gradient-text whitespace-nowrap">{t.hero.titleHighlight}</span>{" "}
              Partner
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/services" className="w-full sm:w-auto">
                <Button variant="rainbow" size="lg" className="w-full sm:w-auto">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm">
                  <Phone className="w-5 h-5" />
                  {t.hero.ctaSecondary}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-6 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-8">
              {[
                { value: t.hero.statYears, label: t.hero.statYearsLabel, color: "from-blue-400 to-indigo-400" },
                { value: t.hero.statClients, label: t.hero.statClientsLabel, color: "from-blue-500 to-indigo-500" },
                { value: t.hero.statAccuracy, label: t.hero.statAccuracyLabel, color: "from-blue-400 to-sky-400" },
              ].map((stat) => (
                <div key={stat.label} className="relative">
                  <div className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main card with rainbow border */}
              <div className="rainbow-border rounded-3xl">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-white/10 backdrop-blur-xl rounded-3xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">GST Dashboard</div>
                      <div className="text-sm text-slate-400">All your filings in one place</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "GSTR-3B (March)", status: "Filed ✓", color: "text-emerald-400" },
                      { label: "GSTR-1 (March)", status: "Pending", color: "text-amber-400" },
                      { label: "ITR (FY 2024-25)", status: "In Progress", color: "text-cyan-400" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                        <span className="text-sm text-slate-300">{item.label}</span>
                        <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Next Due Date</span>
                      <span className="text-white font-medium">Apr 20, 2025</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Floating card 1 */}
              <motion.div
                animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-blue-600/80 to-indigo-600/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-300" />
                  <span className="text-sm text-white font-medium">99% Accuracy</span>
                </div>
              </motion.div>

              {/* Floating card 2 */}
              <motion.div
                animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-8 bg-gradient-to-br from-blue-700/80 to-indigo-700/80 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm text-white font-medium">100% Secure</span>
                </div>
              </motion.div>

              {/* Floating sparkle */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 left-1/2"
              >
                <Sparkles className="w-6 h-6 text-amber-400" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
