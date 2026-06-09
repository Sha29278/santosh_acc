"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubmissions = () => {
    setLoading(true);
    fetch("/api/contact-submissions")
      .then((r) => r.json())
      .then((data) => {
        setSubmissions(Array.isArray(data) ? data : []);
        setLastUpdated(new Date());
      })
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubmissions();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSubmissions, 30000);
    // Also refresh when user returns to the tab
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchSubmissions();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const filtered = submissions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.service.toLowerCase().includes(q) ||
      s.message.toLowerCase().includes(q)
    );
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Contact Submissions</h1>
          <p className="text-sm text-slate-500 mt-1">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""} received
          </p>
          {lastUpdated && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              Auto-refreshes every 5s · Last updated {lastUpdated.toLocaleTimeString("en-IN")}
            </p>
          )}
        </div>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
        />
      </div>

      {/* Submissions List */}
      {loading && submissions.length === 0 ? (
        <div className="text-center py-20 text-slate-400">Loading submissions...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">
            {search ? "No submissions match your search" : "No submissions yet"}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            {search
              ? "Try a different search term"
              : "Submissions will appear here when customers contact you"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((sub, i) => {
            const isOpen = expanded[sub.id] !== false;
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm"
              >
                {/* Collapsed header */}
                <button
                  onClick={() =>
                    setExpanded((prev) => ({ ...prev, [sub.id]: !isOpen }))
                  }
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {sub.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {sub.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {sub.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(sub.timestamp)}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full shrink-0">
                    {sub.service}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-slate-100">
                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Email
                        </label>
                        <a
                          href={`mailto:${sub.email}`}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-1"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {sub.email}
                        </a>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Phone
                        </label>
                        <a
                          href={`tel:${sub.phone.replace(/\s+/g, "")}`}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mt-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {sub.phone}
                        </a>
                      </div>
                    </div>

                    {sub.message && (
                      <div className="mt-4">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Message
                        </label>
                        <p className="text-sm text-slate-700 mt-1 bg-slate-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">
                          {sub.message}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-3">
                      <a
                        href={`tel:${sub.phone.replace(/\s+/g, "")}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Back
                      </a>
                      <a
                        href={`mailto:${sub.email}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Send Email
                      </a>
                      <button
                        onClick={async () => {
                          if (!confirm(`Delete submission from ${sub.name}?`)) return;
                          setDeleting(sub.id);
                          try {
                            const res = await fetch("/api/contact-submissions", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ id: sub.id }),
                            });
                            if (res.ok) {
                              setSubmissions((prev) => prev.filter((s) => s.id !== sub.id));
                            } else {
                              alert("Failed to delete. Try again.");
                            }
                          } catch {
                            alert("Network error. Try again.");
                          } finally {
                            setDeleting(null);
                          }
                        }}
                        disabled={deleting === sub.id}
                        className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleting === sub.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
