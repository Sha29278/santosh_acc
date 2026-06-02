"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { services } from "@/data/site-data";
import { ArrowRight, FileCheck, FileText, Landmark, Receipt, Building2, Briefcase, Rocket, Building, Calculator, Users, SearchCheck, Lightbulb } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  FileCheck, FileText, Landmark, Receipt, Building2, Briefcase,
  Rocket, Building, Calculator, Users, SearchCheck, Lightbulb,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function ServicesSection() {
  const { t } = useLanguage();
  return (
    <section
      id="services"
      className="relative py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-20 -right-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 -left-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.services.badge}
          title={t.services.title}
          subtitle={t.services.subtitle}
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <motion.div key={service.id} variants={cardVariants}>
                <Link href={"/services#" + service.id}>
                  <Card hover className="h-full group cursor-pointer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className={"w-12 h-12 rounded-2xl bg-gradient-to-br " + service.gradient + " flex items-center justify-center mb-4 shadow-lg"}>
                        {Icon && <Icon className="w-6 h-6 text-white" />}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:gradient-text transition-all">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                        {t.services.learnMore} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
