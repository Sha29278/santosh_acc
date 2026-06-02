"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { services } from "@/data/site-data";
import { Check, ArrowRight, FileCheck, FileText, Landmark, Receipt, Building2, Briefcase, Rocket, Building, Calculator, Users, SearchCheck, Lightbulb, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  FileCheck, FileText, Landmark, Receipt, Building2, Briefcase,
  Rocket, Building, Calculator, Users, SearchCheck, Lightbulb,
};

const inclusions: Record<string, string[]> = {
  "gst-registration": ["PAN verification", "Business document review", "GSTIN application filing", "ARN tracking", "GST certificate delivery"],
  "gst-return": ["GSTR-1 filing", "GSTR-3B filing", "Input tax credit reconciliation", "Purchase-sales matching", "Deadline reminders"],
  "income-tax": ["ITR-1 to ITR-7 preparation", "Tax computation", "Document verification", "E-filing", "Refund tracking"],
  "tds": ["TDS computation", "Form 24Q, 26Q, 27Q filing", "TDS certificate generation", "Quarterly compliance", "Deadline management"],
  "roc-compliance": ["Annual return filing", "Financial statement filing", "Board meeting minutes", "Statutory register maintenance", "MCA form filing"],
  "company-registration": ["Company name reservation", "DIN & DSC application", "MOA & AOA drafting", "Incorporation certificate", "PAN & TAN application"],
  "msme-registration": ["Udyam registration", "Document preparation", "Industry classification", "Certificate download", "Government scheme guidance"],
  "accounting": ["Books of accounts maintenance", "Bank reconciliation", "Accounts payable/receivable", "Financial statements", "Management reports"],
  "payroll": ["Salary processing", "PF & ESI compliance", "TDS on salary", "Payslip generation", "Form 16 preparation"],
  "audit": ["Statutory audit", "Tax audit", "Internal audit", "Stock audit", "Audit report preparation"],
  "tax-consultation": ["Tax planning", "GST advisory", "International tax", "Estate planning", "Business restructuring"],
};

const gradientPairs = [
  { from: "from-blue-50", via: "via-indigo-50/30", to: "to-blue-100/20" },
  { from: "from-indigo-50", via: "via-blue-50/30", to: "to-sky-50/20" },
  { from: "from-sky-50", via: "via-blue-50/30", to: "to-indigo-50/20" },
];

const accentColors = [
  { gradient: "from-blue-600 to-indigo-600", check: "text-blue-600", checkBg: "bg-blue-100" },
  { gradient: "from-indigo-500 to-blue-600", check: "text-indigo-600", checkBg: "bg-indigo-100" },
  { gradient: "from-sky-500 to-blue-600", check: "text-sky-600", checkBg: "bg-sky-100" },
];

export default function ServicesPage() {
  const { t } = useLanguage();
  return (
    <div className="pt-20">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
        <div className="absolute top-10 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.services.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Tax &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
                Business Solutions
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              End-to-end services designed to keep your business compliant and growth-focused.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon];
            const items = inclusions[service.id] || [];
            const bgPair = gradientPairs[index % gradientPairs.length];
            const accent = accentColors[index % accentColors.length];
            return (
              <motion.div
                key={service.id}
                id={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="scroll-mt-24"
              >
                <Card className={`p-6 md:p-8 lg:p-12 relative overflow-hidden group hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${bgPair.from} ${bgPair.via} ${bgPair.to}`}>
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${accent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-start">
                    <div>
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${accent.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {Icon && <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />}
                      </div>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4">{service.title}</h2>
                      <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
                      <Link href="/contact">
                        <Button variant="primary">
                          Get Started <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/60">
                      <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r ${accent.gradient}">
                          What&apos;s Included
                        </span>
                      </h3>
                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm text-slate-700">
                            <span className={`w-5 h-5 rounded-full ${accent.checkBg} flex items-center justify-center flex-shrink-0`}>
                              <Check className={`w-3 h-3 ${accent.check}`} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
