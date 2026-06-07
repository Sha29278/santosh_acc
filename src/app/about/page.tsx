"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { Shield, Target, Eye, Award, Quote, Sparkles, GraduationCap, Briefcase, BookOpen, User, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const valueIcons: React.ElementType[] = [Shield, Target, Eye, Award];
const valueGradients = [
  "from-blue-600 to-indigo-600",
  "from-blue-500 to-indigo-500",
  "from-sky-500 to-blue-600",
  "from-blue-600 to-indigo-600",
];
const valueShadows = ["shadow-blue-200", "shadow-blue-200", "shadow-sky-200", "shadow-blue-200"];

const statGradients = [
  "from-blue-600 to-indigo-600",
  "from-blue-500 to-indigo-500",
  "from-sky-500 to-blue-600",
  "from-blue-600 to-indigo-700",
  "from-blue-500 to-indigo-600",
  "from-indigo-500 to-blue-600",
  "from-sky-500 to-indigo-500",
  "from-blue-600 to-sky-600",
];

const founderInfo = [
  { icon: "GraduationCap", title: "Education", desc: "B.Com in Accounting & Finance from Dibrugarh University (2009–2012)" },
  { icon: "Briefcase", title: "Latest Role", desc: "Accountant at Kaziranga University, handling financial operations, payroll, and taxation (2023–2025)" },
  { icon: "Award", title: "Industry Experience", desc: "Manufacturing cost accounting at Electrokings India and multi-client tax consultancy at S.K Kalani & Co." },
  { icon: "BookOpen", title: "Expertise", desc: "GST, Income Tax, TDS/TCS, PF/ESIC, Tally Prime, SAP, Odoo, and Advanced Excel" },
];

const founderIconMap: Record<string, React.ElementType> = { GraduationCap, Briefcase, Award, BookOpen };

export default function AboutPage() {
  const { t } = useLanguage();
  const [expandedCompanies, setExpandedCompanies] = useState<Record<number, boolean>>({});
  const PHOTOS_SHOWN = 3;
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
            {(t.about?.team?.highlights || []).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 text-center hover:border-white/20 transition-all duration-300">
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${statGradients[i % statGradients.length]} mb-1`}>
                    {stat.number}
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
            {(t.about?.values?.items || []).map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              const grad = valueGradients[i % valueGradients.length];
              const shad = valueShadows[i % valueShadows.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center h-full group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${grad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mx-auto mb-4 shadow-lg ${shad} group-hover:scale-110 transition-transform duration-300`}>
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
          {/* Founder Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mt-8"
          >
            <Card className="relative overflow-hidden">
              {/* Gradient accent top */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Avatar */}
                  <div className="shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Santosh Sharma</h3>
                    <p className="text-sm sm:text-base text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium">
                      Founder & Accountant — AccTax Solutions
                    </p>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      Results-oriented Accountant with 13+ years of experience across education, manufacturing, and consulting sectors. Specializes in financial reporting, taxation (GST & Income Tax), statutory compliance, audit coordination, and managing complex accounting operations. Proficient in Tally Prime, SAP, Odoo, and Advanced Excel.
                    </p>
                  </div>
                </div>

                {/* Founder Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  {founderInfo.map((item, i) => {
                    const Icon = founderIconMap[item.icon];
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/50"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                          {Icon && <Icon className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>              </motion.div>

          {/* Companies Worked At Section */}
          {(t.about?.companies || []).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto mt-10"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-8">
                Experience Across Industries
              </h3>
              <div className="space-y-4">
                {(t.about?.companies || []).map((company: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 flex items-start gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                  >
                    {/* Company Icon */}
                    <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200 flex items-center justify-center">
                      <Briefcase className="w-7 h-7 sm:w-9 sm:h-9 text-slate-400" />
                    </div>
                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {company.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium mt-0.5">
                        {company.role}
                      </p>
                      {company.description && (
                        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                          {company.description}
                        </p>
                      )}
                      {/* Company Photos */}
                      {(company.photos || []).filter((p: string) => p).length > 0 && (() => {
                        const photos = (company.photos || []).filter((p: string) => p);
                        const isExpanded = expandedCompanies[i];
                        const visiblePhotos = isExpanded ? photos : photos.slice(0, PHOTOS_SHOWN);
                        const hiddenCount = photos.length - PHOTOS_SHOWN;
                        return (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-3">
                              {visiblePhotos.map((photoUrl: string, pIdx: number) => (
                                <div
                                  key={pIdx}
                                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all duration-300"
                                >
                                  <img
                                    src={photoUrl}
                                    alt={`${company.name} photo ${pIdx + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            {photos.length > PHOTOS_SHOWN && (
                              <button
                                onClick={() => setExpandedCompanies((prev) => ({ ...prev, [i]: !isExpanded }))}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                {isExpanded ? (
                                  <>Show Less <ChevronDown className="w-3.5 h-3.5 rotate-180 transition-transform" /></>
                                ) : (
                                  <>Show More (+{hiddenCount}) <ChevronDown className="w-3.5 h-3.5 transition-transform" /></>
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </section>
    </div>
  );
}
