"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2 } from "lucide-react";
import { loadCache, saveCache } from "@/lib/admin/client-cache";

interface FAQ {
  question: string;
  answer: string;
}

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const cached = loadCache<FAQ[]>("faqs");
    if (cached && cached.length > 0) {
      setFaqs(cached);
      setLoading(false);
      return;
    }
    fetch("/api/data/faqs")
      .then((r) => r.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setFaqs(items);
        saveCache("faqs", items);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    await fetch("/api/data/faqs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(faqs),
    });
    setSaving(false);
    saveCache("faqs", faqs);
    setSuccess("FAQs saved! Live on website in ~60 seconds.");
    setTimeout(() => setSuccess(""), 5000);
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { question: "New Question", answer: "Answer goes here." }]);
  };

  const remove = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const update = (index: number, field: keyof FAQ, value: string) => {
    setFaqs((prev) => prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)));
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
          <p className="text-sm text-slate-500 mt-1">Manage frequently asked questions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addFaq}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-100 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => update(index, "question", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => update(index, "answer", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none"
                  />
                </div>
              </div>
              <button
                onClick={() => remove(index)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No FAQs yet</p>
          <button onClick={addFaq} className="text-blue-600 text-sm mt-2 hover:underline">
            Add your first FAQ
          </button>
        </div>
      )}
    </div>
  );
}
