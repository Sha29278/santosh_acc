"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Landmark,
  RefreshCw,
  ArrowRight,
  Bell,
  BellOff,
  X,
  Timer,
  CalendarDays,
  Send,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface DueDateItem {
  id: string;
  category: "gst" | "income-tax";
  form: string;
  title: string;
  description: string;
  period: string;
  dueDate: string;
  type: string;
  url: string;
}

type FilterType = "all" | "gst" | "income-tax";

// ─── Live Countdown ────────────────────────────────────────────────────────

function LiveCountdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return <span className="text-[10px] font-bold text-red-600 animate-pulse">Due Now!</span>;
  }

  return (
    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg px-2 py-1 border border-red-100">
      <Timer className="w-3 h-3 text-red-500" />
      <span className="text-[10px] font-mono font-bold tabular-nums">
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

const StatusBadge = ({ daysLeft, t }: { daysLeft: number; t: ReturnType<typeof useLanguage>["t"] }) => {
  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700">
        <AlertTriangle className="w-3 h-3" />
        {t.complianceCalendar.overdue_label}
      </span>
    );
  }
  if (daysLeft <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700">
        <Clock className="w-3 h-3" />
        {daysLeft === 0 ? t.complianceCalendar.dueToday : `${daysLeft}${t.complianceCalendar.daysLeft}`}
      </span>
    );
  }
  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
        <Clock className="w-3 h-3" />
        {daysLeft}{t.complianceCalendar.daysLeft}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">
      <CheckCircle2 className="w-3 h-3" />
      {daysLeft}{t.complianceCalendar.daysLeft}
    </span>
  );
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysLeft(dateStr: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getUrgencyColor(daysLeft: number): string {
  if (daysLeft < 0) return "border-l-red-500";
  if (daysLeft <= 7) return "border-l-amber-500";
  if (daysLeft <= 30) return "border-l-blue-500";
  return "border-l-green-500";
}

export default function ComplianceCalendar() {
  const { t } = useLanguage();
  const [dueDates, setDueDates] = useState<DueDateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    loadDueDates();
    setLastSynced(localStorage.getItem("due-dates-last-synced"));
  }, []);

  const loadDueDates = () => {
    fetch("/api/data/due-dates")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDueDates(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      // Attempt to fetch fresh data from our API (which could later proxy from gov sites)
      const res = await fetch("/api/sync-due-dates");
      if (res.ok) {
        await loadDueDates();
        const now = new Date().toLocaleString("en-IN");
        localStorage.setItem("due-dates-last-synced", now);
        setLastSynced(now);
      }
    } catch {
      // Silently fail — data is already loaded
    }
    setSyncing(false);
  };

  // ─── Reminder System ──────────────────────────────────────────────────
  const [reminders, setReminders] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("compliance-reminders");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return new Set(parsed);
        }
      } catch {}
    }
    return new Set();
  });
  const [selectedEvent, setSelectedEvent] = useState<DueDateItem | null>(null);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [emailNotify, setEmailNotify] = useState("");
  const [notifySaved, setNotifySaved] = useState(false);
  const [notifEmail, setNotifEmail] = useState<string | null>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("notif-email");
    return null;
  });
  const [showSubscribe, setShowSubscribe] = useState(!notifEmail);

  const toggleReminder = useCallback((id: string) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("compliance-reminders", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const handleSubscribe = () => {
    if (emailNotify && emailNotify.includes("@")) {
      localStorage.setItem("notif-email", emailNotify);
      setNotifEmail(emailNotify);
      setNotifySaved(true);
      setShowSubscribe(false);
      setTimeout(() => setNotifySaved(false), 3000);
    }
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem("notif-email");
    setNotifEmail(null);
    setShowSubscribe(true);
  };

  // ─── Summary Stats ────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueCount = dueDates.filter((d) => new Date(d.dueDate).getTime() < today.getTime()).length;
  const dueThisWeek = dueDates.filter((d) => {
    const diff = new Date(d.dueDate).getTime() - today.getTime();
    return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const dueThisMonth = dueDates.filter((d) => {
    const diff = new Date(d.dueDate).getTime() - today.getTime();
    return diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  // Sort by due date (closest first)
  const sorted = [...dueDates].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const filtered = sorted.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  // Take next 10 upcoming items (or all if expanded)
  const displayLimit = showAllUpcoming ? filtered.length : 10;
  const upcoming = filtered.slice(0, displayLimit);

  // Desktop columns respect the active filter
  const showGst = filter === "all" || filter === "gst";
  const showIt = filter === "all" || filter === "income-tax";

  const gstItems = sorted
    .filter((d) => d.category === "gst")
    .slice(0, filter === "gst" ? 20 : 6);
  const itItems = sorted
    .filter((d) => d.category === "income-tax")
    .slice(0, filter === "income-tax" ? 20 : 6);

  if (loading) {
    return (
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        className="absolute top-40 -left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <SectionTitle
            badge={t.complianceCalendar.badge}
            title={t.complianceCalendar.title}
            subtitle={t.complianceCalendar.subtitle}
            align="left"
            className="mb-0"
          />
          <div className="flex items-center gap-3 shrink-0">
            {lastSynced && (
              <span className="text-[10px] text-slate-400 hidden sm:block">
                {t.complianceCalendar.lastSynced} {lastSynced}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? t.complianceCalendar.syncing : t.complianceCalendar.sync}
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-center hover:shadow-md transition-shadow">                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t.complianceCalendar.total}</p>
            <p className="text-xl font-bold text-slate-800">{dueDates.length}</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-red-100 text-center hover:shadow-md transition-shadow">                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t.complianceCalendar.overdue}</p>
            <p className={`text-xl font-bold ${overdueCount > 0 ? "text-red-600" : "text-green-600"}`}>
              {overdueCount}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-amber-100 text-center hover:shadow-md transition-shadow">                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t.complianceCalendar.dueThisWeek}</p>
            <p className={`text-xl font-bold ${dueThisWeek > 0 ? "text-amber-600" : "text-slate-800"}`}>
              {dueThisWeek}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-blue-100 text-center hover:shadow-md transition-shadow">                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{t.complianceCalendar.dueThisMonth}</p>
            <p className="text-xl font-bold text-blue-600">{dueThisMonth}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { value: "all" as const, label: t.complianceCalendar.allDates },
            { value: "gst" as const, label: t.complianceCalendar.gst },
            { value: "income-tax" as const, label: t.complianceCalendar.incomeTax },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                filter === f.value
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {f.value === "gst" && <FileText className="w-3.5 h-3.5 inline mr-1.5" />}
              {f.value === "income-tax" && <Landmark className="w-3.5 h-3.5 inline mr-1.5" />}
              {f.label}
            </button>
          ))}
          <div className="flex-1" />
          <span className="text-xs text-slate-400">
            {t.complianceCalendar.upcomingCount.replace("{count}", filtered.length.toString())}
          </span>
        </div>

        {/* Dual-panel layout for larger screens */}
        <div className={`hidden lg:grid gap-6 ${showGst && showIt ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
          {/* GST Column */}
          {showGst && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{t.complianceCalendar.gstTitle}</h3>
                    <p className="text-xs text-slate-500">{t.complianceCalendar.gstSubtitle}</p>
                  </div>
                  <a
                    href="https://www.gst.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-2">
                  {gstItems.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6">{t.complianceCalendar.noDates}</p>
                  )}
                  {gstItems.map((item, idx) => {
                    const daysLeft = getDaysLeft(item.dueDate);
                    const hasReminder = reminders.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className={`block p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all border-l-4 ${getUrgencyColor(daysLeft)} cursor-pointer`}
                        onClick={() => setSelectedEvent(item)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{item.form}</span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[10px] text-slate-400">{item.period}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                            {/* Live countdown for urgent items */}
                            {daysLeft <= 7 && daysLeft >= 0 && (
                              <div className="mt-2">
                                <LiveCountdown targetDate={item.dueDate} />
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                            <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">{formatDate(item.dueDate)}</p>
                            <StatusBadge daysLeft={daysLeft} t={t} />
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleReminder(item.id); }}
                              className={`p-1.5 rounded-lg transition-all ${
                                hasReminder
                                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-blue-500"
                              }`}
                              title={hasReminder ? t.complianceCalendar.removeReminder : t.complianceCalendar.setReminder}
                            >
                              {hasReminder ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {filter !== "gst" && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setFilter("gst")}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                    >
                      {t.complianceCalendar.viewAllGst} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Income Tax Column */}
          {showIt && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500" />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <Landmark className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{t.complianceCalendar.incomeTaxTitle}</h3>
                    <p className="text-xs text-slate-500">{t.complianceCalendar.incomeTaxSubtitle}</p>
                  </div>
                  <a
                    href="https://eportal.incometax.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-indigo-600 hover:text-indigo-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="space-y-2">
                  {itItems.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-6">{t.complianceCalendar.noDates}</p>
                  )}
                  {itItems.map((item, idx) => {
                    const daysLeft = getDaysLeft(item.dueDate);
                    const hasReminder = reminders.has(item.id);
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className={`block p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all border-l-4 ${getUrgencyColor(daysLeft)} cursor-pointer`}
                        onClick={() => setSelectedEvent(item)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{item.form}</span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[10px] text-slate-400">{item.period}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</p>
                            {daysLeft <= 7 && daysLeft >= 0 && (
                              <div className="mt-2">
                                <LiveCountdown targetDate={item.dueDate} />
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                            <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">{formatDate(item.dueDate)}</p>
                            <StatusBadge daysLeft={daysLeft} t={t} />
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleReminder(item.id); }}
                              className={`p-1.5 rounded-lg transition-all ${
                                hasReminder
                                  ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-indigo-500"
                              }`}
                              title={hasReminder ? t.complianceCalendar.removeReminder : t.complianceCalendar.setReminder}
                            >
                              {hasReminder ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {filter !== "income-tax" && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setFilter("income-tax")}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
                    >
                      {t.complianceCalendar.viewAllIt} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>

        {/* Single column for mobile/tablet */}
        <div className="lg:hidden space-y-4">
          {upcoming.length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-200" />
              <p className="text-slate-500 font-medium">{t.complianceCalendar.noDates}</p>
              <p className="text-xs text-slate-400 mt-1">{t.complianceCalendar.addDatesHint}</p>
            </Card>
          ) : (
            upcoming.map((item, idx) => {
              const daysLeft = getDaysLeft(item.dueDate);
              const isGst = item.category === "gst";
              const hasReminder = reminders.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => setSelectedEvent(item)}
                  className={`block bg-white rounded-xl p-4 border border-slate-100 hover:shadow-md transition-all border-l-4 ${getUrgencyColor(daysLeft)} cursor-pointer`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isGst
                          ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                          : "bg-gradient-to-br from-indigo-600 to-blue-600"
                      }`}>
                        {isGst ? (
                          <FileText className="w-4 h-4 text-white" />
                        ) : (
                          <Landmark className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${
                            isGst ? "text-blue-600" : "text-indigo-600"
                          }`}>
                            {item.form}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[10px] text-slate-400">{item.category === "gst" ? "GST" : "Income Tax"}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.period}</p>
                        {daysLeft <= 7 && daysLeft >= 0 && (
                          <div className="mt-2">
                            <LiveCountdown targetDate={item.dueDate} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                      <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">{formatDate(item.dueDate)}</p>
                      <StatusBadge daysLeft={daysLeft} t={t} />
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleReminder(item.id); }}
                        className={`p-1.5 rounded-lg transition-all ${
                          hasReminder
                            ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                            : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-blue-500"
                        }`}
                        title={hasReminder ? t.complianceCalendar.removeReminder : t.complianceCalendar.setReminder}
                      >
                        {hasReminder ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Show All / Show Less toggle */}
        {filtered.length > 10 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAllUpcoming(!showAllUpcoming)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:shadow-sm transition-all"
            >
              <CalendarDays className="w-4 h-4" />
              {showAllUpcoming ? t.complianceCalendar.showLess : `${t.complianceCalendar.showAll} ${filtered.length}`}
              <ArrowRight className={`w-3 h-3 transition-transform ${showAllUpcoming ? "rotate-90" : ""}`} />
            </button>
          </div>
        )}

        {/* Email Notification Subscribe */}
        <div className="mt-8">
          {showSubscribe ? (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-semibold text-sm sm:text-base">{t.complianceCalendar.getReminders}</h4>
                  <p className="text-xs text-white/70 mt-0.5">
                    {t.complianceCalendar.getRemindersDesc}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.value)}
                    className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl text-sm text-slate-900 placeholder-slate-400 border-0 outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button
                    onClick={handleSubscribe}
                    className="px-5 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-all shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {notifySaved && (
                <p className="mt-2 text-xs text-emerald-300 text-center sm:text-left">✓ You'll receive deadline reminders!</p>
              )}
            </div>
          ) : notifEmail ? (
            <div className="bg-emerald-50 rounded-2xl p-4 sm:p-6 border border-emerald-200">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">{t.complianceCalendar.remindersActive} <strong>{notifEmail}</strong></p>
                    <p className="text-xs text-emerald-600">{t.complianceCalendar.getRemindersDesc}</p>
                  </div>
                </div>
                <button
                  onClick={handleUnsubscribe}
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-all whitespace-nowrap"
                >
                                    {t.complianceCalendar.unsubscribe}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Source links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <span>{t.complianceCalendar.dataSourcedFrom}</span>
          <a
            href="https://www.gst.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            <FileText className="w-3 h-3" />
            gst.gov.in
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://eportal.incometax.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <Landmark className="w-3 h-3" />
            eportal.incometax.gov.in
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`h-2 ${
                selectedEvent.category === "gst"
                  ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500"
                  : "bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500"
              }`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedEvent.category === "gst"
                        ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                        : "bg-gradient-to-br from-indigo-600 to-blue-600"
                    }`}>
                      {selectedEvent.category === "gst" ? (
                        <FileText className="w-6 h-6 text-white" />
                      ) : (
                        <Landmark className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedEvent.title}</h3>
                      <p className="text-xs text-slate-500">
                        {selectedEvent.form} • {selectedEvent.period}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all"
                  >
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{selectedEvent.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{t.complianceCalendar.dueDateLabel}</p>
                      <p className="text-sm font-bold text-slate-900">{formatDate(selectedEvent.dueDate)}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{t.complianceCalendar.categoryLabel}</p>
                      <p className="text-sm font-bold text-slate-900 capitalize">
                        {selectedEvent.category === "gst" ? "GST" : "Income Tax"}
                      </p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{t.complianceCalendar.formLabel}</p>
                      <p className="text-sm font-bold text-slate-900">{selectedEvent.form}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{t.complianceCalendar.statusLabel}</p>
                      <div className="mt-0.5">
                        <StatusBadge daysLeft={getDaysLeft(selectedEvent.dueDate)} t={t} />
                      </div>
                    </div>
                  </div>

                  {/* Live countdown in modal */}
                  {getDaysLeft(selectedEvent.dueDate) >= 0 && (
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm font-medium text-indigo-800">{t.complianceCalendar.timeRemaining}</span>
                        </div>
                        <LiveCountdown targetDate={selectedEvent.dueDate} />
                      </div>
                    </div>
                  )}

                  {/* Reminder toggle in modal */}
                  <button
                    onClick={() => toggleReminder(selectedEvent.id)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                      reminders.has(selectedEvent.id)
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {reminders.has(selectedEvent.id) ? (
                      <><Bell className="w-4 h-4" /> {t.complianceCalendar.reminderSet}</>
                    ) : (
                      <><BellOff className="w-4 h-4" /> {t.complianceCalendar.setReminder}</>
                    )}
                  </button>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <a
                      href={selectedEvent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                      {t.complianceCalendar.fileNow}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      {t.complianceCalendar.close}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
