"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/button";
import { ArrowRight, Phone, Shield, CalendarDays, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useSiteConfig } from "@/lib/use-site-config";

interface ApiDueDate {
  id: string;
  category: "gst" | "income-tax";
  dueDate: string;
  title: string;
}

interface CalendarDate {
  day: number;
  month: number;
  label: string;
  type: "gst" | "it";
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ─── Convert API due dates to calendar dates ──────────────────────────────

function apiToCalendarDates(apiDates: ApiDueDate[]): CalendarDate[] {
  const seen = new Set<string>();
  const result: CalendarDate[] = [];

  for (const d of apiDates) {
    const date = new Date(d.dueDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // JS months are 0-indexed
    const key = `${day}-${month}`;

    // Deduplicate: only keep one entry per day-month combo
    if (!seen.has(key)) {
      seen.add(key);
      result.push({
        day,
        month,
        label: d.title,
        type: d.category === "gst" ? "gst" : "it",
      });
    }
  }

  // Sort by month then day
  result.sort((a, b) => a.month - b.month || a.day - b.day);
  return result;
}

// ─── Calendar component ────────────────────────────────────────────────────

function AnimatedCalendar() {
  const [mounted, setMounted] = useState(false);
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [datesLoaded, setDatesLoaded] = useState(false);

  useEffect(() => {
    // Auto-sync: fetch latest due dates from API
    fetch("/api/data/due-dates")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCalendarDates(apiToCalendarDates(data));
        }
      })
      .catch(() => {})
      .finally(() => {
        setDatesLoaded(true);
        setMounted(true);
      });
  }, []);

  // During SSR / hydration, render a placeholder that matches
  if (!mounted) {
    return (
      <div className="rainbow-border rounded-3xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Compliance Calendar</div>
              <div className="text-xs text-slate-400">Loading...</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-[10px] font-medium text-slate-500 py-1">{day.slice(0, 2)}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`p-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={`d-${i}`} className="aspect-square rounded-lg bg-white/5" />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-4">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const thisMonthDates = calendarDates.filter((d) => d.month === currentMonth + 1);

  const getDateType = (day: number, month: number) => {
    const match = calendarDates.find((d) => d.day === day && d.month === month);
    return match?.type || null;
  };

  const getDateLabel = (day: number, month: number) => {
    const match = calendarDates.find((d) => d.day === day && d.month === month);
    return match?.label || null;
  };

  // Show first 3 due dates of the month (or fewer if not loaded yet)
  const visibleDates = datesLoaded ? thisMonthDates.slice(0, 3) : [];

  return (
    <div className="rainbow-border rounded-3xl">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 sm:p-6 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm">Compliance Calendar</div>
            <div className="text-xs text-slate-400">
              {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] font-medium text-slate-500 py-1">
              {day.slice(0, 2)}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateType = getDateType(day, currentMonth + 1);
            const label = getDateLabel(day, currentMonth + 1);
            const isToday = day === today.getDate();
            const isClickable = dateType !== null;

            const handleDateClick = () => {
              if (!isClickable) return;
              // Dispatch a custom event with the clicked date info
              window.dispatchEvent(
                new CustomEvent("hero-date-clicked", {
                  detail: { month: currentMonth, day },
                })
              );
              // Scroll to the compliance calendar section
              const el = document.getElementById("compliance-calendar");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            };

            return (
              <motion.button
                key={day}
                onClick={handleDateClick}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i + firstDay) * 0.01 }}
                className={`group relative aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
                  ${isToday ? "ring-2 ring-white/60" : ""}
                  ${dateType === "gst" ? "bg-emerald-500/20 text-emerald-300 shadow-sm shadow-emerald-500/20" : ""}
                  ${dateType === "it" ? "bg-red-500/20 text-red-300 shadow-sm shadow-red-500/20" : ""}
                  ${!dateType && !isToday ? "text-slate-400 hover:bg-white/5" : ""}
                  ${!dateType && isToday ? "text-white" : ""}
                  ${isClickable ? "cursor-pointer hover:scale-110 hover:z-10" : "cursor-default"}
                `}
                aria-label={label ? `${day} - ${label}` : `${day}`}
              >
                <span className="relative z-10">{day}</span>
                {dateType === "gst" && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                )}
                {dateType === "it" && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                )}
                {isToday && (
                  <span className="absolute inset-1 rounded-lg border border-white/30" />
                )}
                {label && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {label}
                  </div>
                )}
                {/* Click indicator on marked dates */}
                {isClickable && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span className="text-[10px] text-slate-400">GST</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-400 animate-pulse" />
            <span className="text-[10px] text-slate-400">Income Tax</span>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {!datesLoaded ? (
            <div className="text-[10px] text-slate-500 text-center py-2">Loading...</div>
          ) : visibleDates.length === 0 ? (
            <div className="text-[10px] text-slate-500 text-center py-2">No due dates this month</div>
          ) : (
            visibleDates.map((d, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                  d.type === "gst"
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-red-500/10 text-red-300"
                }`}
              >
                {d.type === "gst" ? (
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                )}
                <span className="font-medium">{d.label}</span>
                <span className="ml-auto text-[10px] opacity-70">{d.month}/{d.day}/{(d.month <= 3 && currentYear+1) || currentYear}</span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const { t } = useLanguage();
  const config = useSiteConfig();
  const logoUrl = config.logoUrl || "";

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-start lg:items-center overflow-x-hidden gradient-hero">
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
              className="flex items-center gap-3 sm:gap-4 flex-wrap mb-3 sm:mb-6"
            >
              {logoUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoUrl}
                  alt="AccTax Solutions"
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              )}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-medium text-white/90">{t.hero.trustBadge}</span>
              </div>
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

          {/* Right - Animated Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <AnimatedCalendar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
