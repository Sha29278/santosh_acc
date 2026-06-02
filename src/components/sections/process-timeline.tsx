"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { processSteps } from "@/data/site-data";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const stepColors = [
  { bg: "from-blue-700 to-blue-600", shadow: "shadow-blue-700/30" },
  { bg: "from-blue-600 to-cyan-600", shadow: "shadow-blue-600/30" },
  { bg: "from-indigo-700 to-indigo-500", shadow: "shadow-indigo-700/30" },
  { bg: "from-sky-600 to-blue-500", shadow: "shadow-sky-600/30" },
  { bg: "from-indigo-600 to-blue-700", shadow: "shadow-indigo-600/30" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function ProcessTimeline() {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.process.badge}
          title={t.process.title}
          subtitle={t.process.subtitle}
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-700 via-blue-600 via-indigo-600 via-sky-600 to-blue-500 rounded-full hidden md:block" />
          <div className="space-y-6 md:space-y-0">
            {processSteps.map((step, index) => (
              <motion.div key={step.step} variants={stepVariants} className="relative md:flex items-start gap-8 pb-6 md:pb-8">
                <div className="flex md:block flex-shrink-0 relative z-10">
                  <div className={"w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br " + stepColors[index].bg + " flex items-center justify-center shadow-lg " + stepColors[index].shadow}>
                    <span className="text-lg md:text-2xl font-bold text-white">{step.step}</span>
                  </div>
                  {/* Mobile connector line */}
                  {index < processSteps.length - 1 && (
                    <div className="md:hidden flex-1 flex items-center ml-4 h-full">
                      <div className={"h-1 w-full rounded-full bg-gradient-to-r " + stepColors[index].bg} />
                    </div>
                  )}
                </div>
                <div className="flex-1 mt-3 md:mt-0">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/50 hover:shadow-lg hover:shadow-blue-600/5 transition-all">
                    <h3 className={"text-lg md:text-xl font-semibold mb-1.5 md:mb-2 text-transparent bg-clip-text bg-gradient-to-r " + stepColors[index].bg}>
                      {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-slate-600">{step.description}</p>
                  </div>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:flex absolute left-13 top-16 h-8 items-center justify-center">
                    <ArrowRight className={"w-5 h-5 " + (stepColors[index].bg.includes("blue") ? "text-blue-400" : "text-indigo-400") + " rotate-90"} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
