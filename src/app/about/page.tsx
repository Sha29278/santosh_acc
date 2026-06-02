"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Shield, Target, Eye, Award, Users, CheckCircle, Quote, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const values = [
  {
    icon: Shield,
    title: "Trust & Integrity",
    desc: "We believe in transparent dealings and maintaining the highest ethical standards in all our services.",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-200",
  },
  {
    icon: Target,
    title: "Accuracy First",
    desc: "Every filing is double-checked to ensure 99%+ accuracy, protecting you from penalties and notices.",
    gradient: "from-blue-500 to-indigo-500",
    shadow: "shadow-blue-200",
  },
  {
    icon: Eye,
    title: "Client Focus",
    desc: "Your financial well-being is our priority. We tailor solutions to your unique business needs.",
    gradient: "from-sky-500 to-blue-600",
    shadow: "shadow-sky-200",
  },
  {
    icon: Award,
    title: "Expert Team",
    desc: "Our team of CAs, CS, and tax professionals brings decades of combined experience to serve you.",
    gradient: "from-blue-600 to-indigo-600",
    shadow: "shadow-blue-200",
  },
];

const stats = [            { value: "10+", label: "Years of Excellence", gradient: "from-blue-600 to-indigo-600" },
            { value: "5000+", label: "Clients Served", gradient: "from-blue-500 to-indigo-500" },
            { value: "99%", label: "Client Satisfaction", gradient: "from-sky-500 to-blue-600" },
            { value: "50+", label: "Expert Professionals", gradient: "from-blue-600 to-indigo-700" },
];

const teamHighlights = [
  { number: "25+", label: "Chartered Accountants" },
  { number: "15+", label: "Company Secretaries" },
  { number: "10+", label: "Tax Consultants" },
  { number: "8+", label: "Legal Advisors" },
];

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.about.badge}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              {t.about.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
                {t.about.titleHighlight}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto"
            >
              {t.about.subtitle}
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-12"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-center hover:border-white/20 transition-all duration-300">
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-lg shadow-blue-200">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              {t.about.mission}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title={t.about.values.title}
            subtitle={t.about.values.subtitle}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center h-full group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${v.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg ${v.shadow} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge={t.about.team.badge}
            title={t.about.team.title}
            subtitle={t.about.team.subtitle}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8">
            {teamHighlights.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
                  {item.number}
                </div>
                <div className="text-sm text-slate-500">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
