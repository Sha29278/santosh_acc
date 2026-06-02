"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { whyChooseUs } from "@/data/site-data";
import { Award, Users, CheckCircle, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const iconMap: Record<string, React.ElementType> = {
  Award, Users, CheckCircle, Shield,
};

const cardStyles = [
  { gradient: "from-blue-600 to-indigo-600", bg: "from-blue-50 to-indigo-50", shadow: "shadow-blue-600/20" },
  { gradient: "from-indigo-500 to-blue-600", bg: "from-indigo-50 to-blue-50", shadow: "shadow-indigo-500/20" },
  { gradient: "from-sky-500 to-blue-600", bg: "from-sky-50 to-blue-50", shadow: "shadow-sky-500/20" },
  { gradient: "from-blue-500 to-indigo-500", bg: "from-blue-50 to-indigo-50", shadow: "shadow-blue-500/20" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function WhyChooseUs() {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="absolute top-40 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-40 -right-20 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.whyChooseUs.badge}
          title={t.whyChooseUs.title}
          subtitle={t.whyChooseUs.subtitle}
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {whyChooseUs.map((item, index) => {
            const Icon = iconMap[item.icon];
            const style = cardStyles[index];
            return (
              <motion.div key={item.title} variants={cardVariants} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={"w-16 h-16 rounded-2xl bg-gradient-to-br " + style.gradient + " flex items-center justify-center mx-auto mb-4 shadow-lg " + style.shadow + " group-hover:scale-110 transition-transform duration-300"}>
                    {Icon && <Icon className="w-8 h-8 text-white" />}
                  </div>
                  <div className={"text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r " + style.gradient + " mb-1"}>
                    {item.stat}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    {item.suffix}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
