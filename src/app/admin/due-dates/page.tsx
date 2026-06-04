"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, FileText, Landmark, RefreshCw, X } from "lucide-react";

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

interface Override {
  id: string;
  dueDate: string;
  reason: string;
  label?: string;
  active: boolean;
  updatedAt: string;
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
  const [tab, setTab] = useState<"manual" | "overrides">("manual");

  // Override state
  const [overrides, setOverrides] = useState<Override[]>([]);
  const [syncedDates, setSyncedDates] = useState<DueDateItem[]>([]);
  const [syncing, setSyncing] = useState(false);

  const loadOverrides = () => {
    fetch("/api/due-date-overrides")
      .then((r) => r.json())
      .then((data) => setOverrides(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetch("/api/data/due-dates")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));

    loadOverrides();
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      await fetch("/api/sync-due-dates");
      const res = await fetch("/api/data/due-dates");
      const data = await res.json();
      setSyncedDates(Array.isArray(data) ? data : []);
      setSuccess("Due dates synced from tax rules!");
    } catch {
      setSuccess("Sync failed");
    }
    setTimeout(() => setSuccess(""), 3000);
    setSyncing(false);
  };

  const saveOverrides = async (updated: Override[]) => {
    await fetch("/api/due-date-overrides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setOverrides(updated);
    setSuccess("Overrides saved! Run sync to apply them.");
    setTimeout(() => setSuccess(""), 3000);
  };

  const toggleOverride = (item: DueDateItem) => {
    const existing = overrides.find((o) => o.id === item.id);
    if (existing) {
      // Remove override
      saveOverrides(overrides.filter((o) => o.id !== item.id));
    } else {
      // Add override with same date initially
      saveOverrides([
        ...overrides,
        {
          id: item.id,
          dueDate: item.dueDate,
          reason: "Government notification",
          active: true,
          updatedAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const updateOverrideField = (id: string, field: keyof Override, value: string | boolean) => {
    const updated = overrides.map((o) =>
      o.id === id ? { ...o, [field]: value, updatedAt: new Date().toISOString() } : o
    );
    setOverrides(updated);
  };

  const saveOverridesNow = () => {
    saveOverrides(overrides);
  };

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
            Manual calendar + auto-synced dates with government override support.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {tab === "manual" && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save All"}
            </button>
          )}
        </div>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setTab("manual")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            tab === "manual"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <FileText className="w-3.5 h-3.5 inline mr-1.5" />
          Manual Calendar
        </button>
        <button
          onClick={() => setTab("overrides")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            tab === "overrides"
              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-200"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5 inline mr-1.5" />
          Synced Dates & Overrides
          {overrides.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
              {overrides.length}
            </span>
          )}
        </button>
      </div>

      {/* ─── TAB: Manual Calendar ──────────────────────────────────── */}
      {tab === "manual" && (
        <div className="grid lg:grid-cols-2 gap-6">
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
                  No GST due dates. Click &quot;Add&quot; to create one.
                </div>
              )}
              {gstItems.map((item) => {
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
                  No Income Tax dates. Click &quot;Add&quot; to create one.
                </div>
              )}
              {itItems.map((item) => {
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
      )}

      {/* ─── TAB: Synced Dates & Overrides ──────────────────────────── */}
      {tab === "overrides" && (
        <div>
          {/* Sync button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Generate & Sync from Tax Rules"}
            </button>
            <span className="text-xs text-slate-400">
              {syncedDates.length} dates generated
            </span>
          </div>

          {/* Active overrides summary */}
          {overrides.filter((o) => o.active).length > 0 && (
            <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm font-medium text-amber-800">
                ⚠️ {overrides.filter((o) => o.active).length} government override(s) active
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                These will be applied when the auto-sync runs. Click items below to modify or remove.
              </p>
            </div>
          )}

          {/* Override list */}
          <div className="space-y-2">
            {overrides.filter((o) => o.active).length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <RefreshCw className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">No overrides yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  When the government issues a notification changing a deadline, find the item below and click &quot;Override&quot; to set a new date.
                </p>
              </div>
            )}
            {overrides
              .filter((o) => o.active)
              .map((ov) => {
                const item = syncedDates.find((d) => d.id === ov.id);
                return (
                  <div
                    key={ov.id}
                    className="bg-white rounded-xl border border-amber-200 border-l-4 border-l-amber-500 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item?.category === "gst" ? (
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                          <span className="text-xs font-semibold text-slate-500 uppercase">
                            {item?.form || ov.id} • {item?.period || "-"}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {item?.title || "Unknown item"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = overrides.filter((o) => o.id !== ov.id);
                          saveOverrides(updated);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 mt-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
                          Override Date
                        </label>
                        <input
                          type="date"
                          value={ov.dueDate}
                          onChange={(e) => updateOverrideField(ov.id, "dueDate", e.target.value)}
                          onBlur={saveOverridesNow}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
                          Reason
                        </label>
                        <input
                          type="text"
                          value={ov.reason}
                          onChange={(e) => {
                            // Update local state immediately for responsive UI
                            setOverrides((prev) =>
                              prev.map((o) =>
                                o.id === ov.id ? { ...o, reason: e.target.value, updatedAt: new Date().toISOString() } : o
                              )
                            );
                          }}
                          onBlur={saveOverridesNow}
                          placeholder="e.g. Government notification dated..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none text-xs bg-white"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2">
                      Original date: {item?.dueDate ? new Date(item.dueDate).toLocaleDateString("en-IN") : "-"}
                      {item && ov.dueDate !== item.dueDate && (
                        <span className="text-amber-600 font-medium">
                          {" "}→ Changed from {new Date(item.dueDate).toLocaleDateString("en-IN")}
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
          </div>

          {/* All synced dates with override toggle */}
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              All Synced Dates — Click to toggle override
            </h3>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-50">
                {syncedDates.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Click &quot;Generate &amp; Sync&quot; to load dates.
                  </div>
                )}
                {syncedDates.map((item) => {
                  const isOverridden = overrides.some((o) => o.id === item.id && o.active);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-2.5 text-xs transition-all ${
                        isOverridden
                          ? "bg-amber-50 border-l-4 border-l-amber-500"
                          : "hover:bg-slate-50 border-l-4 border-l-transparent"
                      }`}
                    >
                      <button
                        onClick={() => toggleOverride(item)}
                        className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                          isOverridden
                            ? "bg-amber-500 text-white"
                            : "bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-600"
                        }`}
                        title={isOverridden ? "Remove override" : "Add override"}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                      <span className={`font-semibold w-20 shrink-0 ${
                        item.category === "gst" ? "text-blue-600" : "text-indigo-600"
                      }`}>
                        {item.form}
                      </span>
                      <span className="text-slate-900 font-medium w-48 truncate shrink-0">
                        {item.title}
                      </span>
                      <span className="text-slate-500 w-28 shrink-0">{item.period}</span>
                      <span className="text-slate-900 font-medium w-28 shrink-0">
                        {new Date(item.dueDate).toLocaleDateString("en-IN")}
                      </span>
                      {isOverridden && (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full shrink-0">
                          Overridden
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
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
