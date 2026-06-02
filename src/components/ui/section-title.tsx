"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  colorful?: boolean;
}

export default function SectionTitle({ badge, title, subtitle, align = "center", className, colorful = true }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "max-w-3xl mb-12",
        align === "center" && "text-center mx-auto",
        align === "left" && "text-left",
        className
      )}
    >
      {badge && (
        <span className={cn(
          "inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4",
          colorful
            ? "bg-gradient-to-r from-blue-100 via-indigo-100 to-sky-100 text-blue-700"
            : "bg-blue-100 text-blue-700"
        )}>
          {badge}
        </span>
      )}
      <h2 className={cn(
        "text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",
        colorful ? "gradient-text" : "text-slate-900"
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg md:text-xl text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
