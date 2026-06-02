"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, FileText, Landmark } from "lucide-react";

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

const FORM_OPTIONS_GST = ["GSTR-1", "GSTR-3B", "GSTR-4", "GSTR-5", "GSTR-5A", "GSTR-6", "GSTR-7", "GSTR-8", "GSTR-9", "GSTR-9C", "CMP-08", "IFF"];
const FORM_OPTIONS_IT = ["ITR Filing", "Advance Tax", "TDS Return", "Tax Audit", "Form 3CEB"];
const TYPE_OPTIONS = ["monthly", "quarterly", "annual", "advance-tax"];

function generateId() {
  return `due-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function AdminDueDates() {
  const [items, setItems] = useState<DueDateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/data/due-dates")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    await fetch("/api/data/due-dates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
    setSaving(false);
    setSuccess("Due dates saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const addItem = (category: "gst" | "income-tax") => {
    setItems((prev) => [
      ...prev,
      {
        id: generateId(),
        category,
        form: category === "gst" ? "GSTR-3B" : "ITR Filing",
        title: category === "gst" ? "New GST Due Date" : "New Income Tax Due Date",
        description: "Description goes here.",
        period: "FY 2025-26",
        dueDate: "2025-12-31",
        type: "monthly",
        url: category === "gst" ? "https://www.gst.gov.in/" : "https://eportal.incometax.gov.in/",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof DueDateItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const gstItems = items.filter((i) => i.category === "gst");
  const itItems = items.filter((i) => i.category === "income-tax");

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Due Dates</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage GST due dates and Income Tax calendar. Data syncs from official government portals.
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* GST Due Dates */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-white" />
              <h2 className="text-white font-semibold text-sm">GST Due Dates</h2>
            </div>
            <button
              onClick={() => addItem("gst")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-all"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="p-4 space-y-3">
            {gstItems.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No GST due dates. Click "Add" to create one.
              </div>
            )}
            {gstItems.map((item, idx) => {
              const globalIdx = items.indexOf(item);
              return (
                <DueDateEditor
                  key={item.id}
                  item={item}
                  index={globalIdx}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  formOptions={FORM_OPTIONS_GST}
                />
              );
            })}
          </div>
        </div>

        {/* Income Tax Calendar */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-white" />
              <h2 className="text-white font-semibold text-sm">Income Tax Calendar</h2>
            </div>
            <button
              onClick={() => addItem("income-tax")}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-all"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="p-4 space-y-3">
            {itItems.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No Income Tax dates. Click "Add" to create one.
              </div>
            )}
            {itItems.map((item, idx) => {
              const globalIdx = items.indexOf(item);
              return (
                <DueDateEditor
                  key={item.id}
                  item={item}
                  index={globalIdx}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  formOptions={FORM_OPTIONS_IT}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DueDateEditor({
  item,
  index,
  onUpdate,
  onRemove,
  formOptions,
}: {
  item: DueDateItem;
  index: number;
  onUpdate: (index: number, field: keyof DueDateItem, value: string) => void;
  onRemove: (index: number) => void;
  formOptions: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-slate-100 rounded-xl p-4"
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
            Form Name
          </label>
          <select
            value={item.form}
            onChange={(e) => onUpdate(index, "form", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs bg-white"
          >
            {formOptions.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
            Type
          </label>
          <select
            value={item.type}
            onChange={(e) => onUpdate(index, "type", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs bg-white"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
            Period
          </label>
          <input
            type="text"
            value={item.period}
            onChange={(e) => onUpdate(index, "period", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
            Due Date
          </label>
          <input
            type="date"
            value={item.dueDate}
            onChange={(e) => onUpdate(index, "dueDate", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
            Title
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={item.title}
              onChange={(e) => onUpdate(index, "title", e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
            />
            <button
              onClick={() => onRemove(index)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
            Description
          </label>
          <input
            type="text"
            value={item.description}
            onChange={(e) => onUpdate(index, "description", e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
          />
        </div>
      </div>
    </motion.div>
  );
}
