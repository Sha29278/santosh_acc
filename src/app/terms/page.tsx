"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Scale } from "lucide-react";

export default function TermsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((data) => setContent(data?.terms || null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-slate-400">Loading...</div>
      </div>
    );
  }

  const title = content?.title || "Terms & Conditions";
  const lastUpdated = content?.lastUpdated || "";
  const bodyContent = (content?.content || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
              {lastUpdated && (
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 sm:p-8 lg:p-10 prose prose-slate max-w-none">
            {bodyContent.split("\n\n").map((paragraph: string, i: number) => {
              // Check if it's a numbered heading (e.g. "1. Acceptance of Terms")
              const headingMatch = paragraph.match(/^(\d+)\.\s+(.+)/);
              if (headingMatch) {
                // Split on first newline: heading is the first line, body is the rest
                const firstNl = paragraph.indexOf("\n");
                const heading = firstNl > 0 ? paragraph.substring(0, firstNl) : paragraph;
                const body = firstNl > 0 ? paragraph.substring(firstNl + 1).trim() : "";
                return (
                  <div key={i} className="mb-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">{heading}</h2>
                    {body && (
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{body}</p>
                    )}
                  </div>
                );
              }
              // Regular paragraph — preserve any internal line breaks
              return (
                <p key={i} className="text-sm text-slate-600 mb-4 leading-relaxed whitespace-pre-wrap">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Questions? Contact{" "}
            <a href="mailto:info@acctaxsolutions.in" className="text-indigo-600 hover:underline">
              info@acctaxsolutions.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
