"use client";

import { useLanguage } from "@/lib/i18n";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "navbar" | "dropdown";
  className?: string;
}

export default function LanguageSwitcher({ variant = "navbar", className }: LanguageSwitcherProps) {
  const { language, toggleLanguage, t } = useLanguage();

  if (variant === "dropdown") {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2 text-sm font-medium rounded-lg transition-all w-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border border-blue-100"
        >
          <Languages className="w-4 h-4" />
          <span>{language === "en" ? t.language.hindi : t.language.english}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border",
        className
      )}
      title={t.language.switchTo}
    >
      <Languages className="w-3.5 h-3.5" />
      <span>{language === "en" ? "हिन्दी" : "English"}</span>
    </button>
  );
}
