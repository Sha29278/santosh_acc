"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { loadCache, saveCache } from "@/lib/admin/client-cache";

interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

interface TaxRegimeData {
  label: string;
  slabs: TaxSlab[];
  standardDeduction: number;
  rebateLimit: number;
  rebateMax: number;
}

const DEFAULT_OLD_SLABS: TaxSlab[] = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250001, max: 500000, rate: 5 },
  { min: 500001, max: 1000000, rate: 20 },
  { min: 1000001, max: null, rate: 30 },
];

const DEFAULT_NEW_SLABS: TaxSlab[] = [
  { min: 0, max: 400000, rate: 0 },
  { min: 400001, max: 800000, rate: 5 },
  { min: 800001, max: 1200000, rate: 10 },
  { min: 1200001, max: 1600000, rate: 15 },
  { min: 1600001, max: 2000000, rate: 20 },
  { min: 2000001, max: 2400000, rate: 25 },
  { min: 2400001, max: null, rate: 30 },
];

export default function AdminTaxSlabs() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);

  const [oldRegime, setOldRegime] = useState<TaxRegimeData>({
    label: "Old Tax Regime",
    slabs: DEFAULT_OLD_SLABS,
    standardDeduction: 50000,
    rebateLimit: 500000,
    rebateMax: 12500,
  });

  const [newRegime, setNewRegime] = useState<TaxRegimeData>({
    label: "New Tax Regime",
    slabs: DEFAULT_NEW_SLABS,
    standardDeduction: 75000,
    rebateLimit: 1200000,
    rebateMax: 60000,
  });

  useEffect(() => {
    const applyData = (data: Record<string, unknown>) => {
      if (data && data.oldSlabs) {
        setOldRegime({
          label: "Old Tax Regime",
          slabs: data.oldSlabs as TaxSlab[],
          standardDeduction: (data.oldStandardDeduction as number) ?? 50000,
          rebateLimit: (data.oldRebateLimit as number) ?? 500000,
          rebateMax: (data.oldRebateMax as number) ?? 12500,
        });
        setNewRegime({
          label: "New Tax Regime",
          slabs: data.newSlabs as TaxSlab[],
          standardDeduction: (data.newStandardDeduction as number) ?? 75000,
          rebateLimit: (data.newRebateLimit as number) ?? 1200000,
          rebateMax: (data.newRebateMax as number) ?? 60000,
        });
      }
    };
    // Load from cache first
    const cached = loadCache<Record<string, unknown>>("tax-slabs");
    if (cached) applyData(cached);
    // Then fetch from API
    fetch("/api/data/tax-slabs")
      .then((r) => r.json())
      .then((data) => { applyData(data); saveCache("tax-slabs", data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");

    const payload = {
      oldSlabs: oldRegime.slabs,
      newSlabs: newRegime.slabs,
      oldStandardDeduction: oldRegime.standardDeduction,
      newStandardDeduction: newRegime.standardDeduction,
      oldRebateLimit: oldRegime.rebateLimit,
      newRebateLimit: newRegime.rebateLimit,
      oldRebateMax: oldRegime.rebateMax,
      newRebateMax: newRegime.rebateMax,
    };

    await fetch("/api/data/tax-slabs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    saveCache("tax-slabs", payload);
    setSuccess("Tax slabs saved! Live on website in ~60 seconds.");
    setTimeout(() => setSuccess(""), 5000);
  };

  const handleReset = () => {
    setOldRegime({
      label: "Old Tax Regime",
      slabs: DEFAULT_OLD_SLABS,
      standardDeduction: 50000,
      rebateLimit: 500000,
      rebateMax: 12500,
    });
    setNewRegime({
      label: "New Tax Regime",
      slabs: DEFAULT_NEW_SLABS,
      standardDeduction: 75000,
      rebateLimit: 1200000,
      rebateMax: 60000,
    });
    setResetConfirm(false);
  };

  const addSlab = (regime: "old" | "new") => {
    const updater = (prev: TaxRegimeData) => {
      const lastSlab = prev.slabs[prev.slabs.length - 1];
      const newMin = lastSlab?.max ? lastSlab.max + 1 : 500000;
      return {
        ...prev,
        slabs: [
          ...prev.slabs.slice(0, -1),
          { min: lastSlab?.min ?? 0, max: newMin - 1, rate: lastSlab?.rate ?? 0 },
          { min: newMin, max: null, rate: 30 },
        ],
      };
    };
    if (regime === "old") setOldRegime(updater);
    else setNewRegime(updater);
  };

  const removeSlab = (regime: "old" | "new", index: number) => {
    if (regime === "old") {
      setOldRegime((prev) => ({
        ...prev,
        slabs: prev.slabs.filter((_, i) => i !== index),
      }));
    } else {
      setNewRegime((prev) => ({
        ...prev,
        slabs: prev.slabs.filter((_, i) => i !== index),
      }));
    }
  };

  const updateSlab = (
    regime: "old" | "new",
    index: number,
    field: keyof TaxSlab,
    value: number
  ) => {
    const updater = (prev: TaxRegimeData) => ({
      ...prev,
      slabs: prev.slabs.map((s, i) =>
        i === index ? { ...s, [field]: field === "max" && value === 0 ? null : value } : s
      ),
    });
    if (regime === "old") setOldRegime(updater);
    else setNewRegime(updater);
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tax Slabs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure income tax slabs and settings for both old and new tax regimes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {resetConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600 font-medium">Confirm reset?</span>
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-all"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setResetConfirm(false)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </button>
          )}
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
        {/* Old Regime */}
        <RegimeEditor
          title="Old Tax Regime"
          color="from-blue-600 to-indigo-600"
          data={oldRegime}
          onUpdateSlab={(index, field, value) => updateSlab("old", index, field, value)}
          onRemoveSlab={(index) => removeSlab("old", index)}
          onAddSlab={() => addSlab("old")}
          onUpdateSetting={(key, value) =>
            setOldRegime((prev) => ({ ...prev, [key]: value }))
          }
        />

        {/* New Regime */}
        <RegimeEditor
          title="New Tax Regime"
          color="from-indigo-600 to-blue-600"
          data={newRegime}
          onUpdateSlab={(index, field, value) => updateSlab("new", index, field, value)}
          onRemoveSlab={(index) => removeSlab("new", index)}
          onAddSlab={() => addSlab("new")}
          onUpdateSetting={(key, value) =>
            setNewRegime((prev) => ({ ...prev, [key]: value }))
          }
        />
      </div>
    </div>
  );
}

function RegimeEditor({
  title,
  color,
  data,
  onUpdateSlab,
  onRemoveSlab,
  onAddSlab,
  onUpdateSetting,
}: {
  title: string;
  color: string;
  data: TaxRegimeData;
  onUpdateSlab: (index: number, field: keyof TaxSlab, value: number) => void;
  onRemoveSlab: (index: number) => void;
  onAddSlab: () => void;
  onUpdateSetting: (key: string, value: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${color} px-5 py-3.5`}>
        <h2 className="text-white font-semibold">{title}</h2>
      </div>

      <div className="p-5 space-y-5">
        {/* Settings */}
        <div className="grid grid-cols-3 gap-3">
          <NumericInput
            label="Std. Deduction"
            value={data.standardDeduction}
            onChange={(v) => onUpdateSetting("standardDeduction", v)}
            prefix="₹"
          />
          <NumericInput
            label="87A Rebate Limit"
            value={data.rebateLimit}
            onChange={(v) => onUpdateSetting("rebateLimit", v)}
            prefix="₹"
          />
          <NumericInput
            label="Max Rebate"
            value={data.rebateMax}
            onChange={(v) => onUpdateSetting("rebateMax", v)}
            prefix="₹"
          />
        </div>

        {/* Slabs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tax Slabs
            </label>
            <button
              onClick={onAddSlab}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-3 h-3" />
              Add Slab
            </button>
          </div>

          <div className="space-y-2">
            {data.slabs.map((slab, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Min (₹)</label>
                    <input
                      type="number"
                      value={slab.min}
                      onChange={(e) => onUpdateSlab(index, "min", parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Max (₹)</label>
                    <input
                      type="number"
                      value={slab.max ?? 0}
                      onChange={(e) => onUpdateSlab(index, "max", parseInt(e.target.value) || 0)}
                      placeholder="∞"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-400 mb-0.5">Rate (%)</label>
                      <input
                        type="number"
                        value={slab.rate}
                        onChange={(e) => onUpdateSlab(index, "rate", parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs"
                      />
                    </div>
                    <button
                      onClick={() => onRemoveSlab(index)}
                      className="mt-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {data.slabs.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">
              No slabs defined. Click &quot;Add Slab&quot; to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NumericInput({
  label,
  value,
  onChange,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] text-slate-400 mb-0.5 uppercase tracking-wider font-medium">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className={`w-full ${prefix ? "pl-6" : "px-2"} pr-2 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs`}
        />
      </div>
    </div>
  );
}
