"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HelpCircle, ArrowLeft, ChevronDown, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/data/faqs")
      .then((r) => r.json())
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-6"
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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Frequently Asked Questions
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Find answers to common questions about our services.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mt-6 mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenIndex(null); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
          />
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No FAQs found</p>
            <p className="text-sm text-slate-400 mt-1">
              {search ? "Try a different search term." : "Check back later for updates."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-xl overflow-hidden transition-all ${
                  openIndex === index
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100 shadow-md"
                    : "bg-white border border-gray-100 hover:border-blue-100 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors"
                >
                  <span className={`font-medium text-sm sm:text-base ${
                    openIndex === index ? "text-blue-700" : "text-slate-900"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    openIndex === index
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
