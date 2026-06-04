"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { loadCache, saveCache } from "@/lib/admin/client-cache";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

const GRADIENTS = [
  "from-blue-600 to-indigo-500",
  "from-blue-600 to-blue-500",
  "from-indigo-600 to-indigo-500",
  "from-blue-600 to-indigo-600",
  "from-blue-600 to-indigo-500",
  "from-blue-600 to-blue-500",
  "from-indigo-600 to-indigo-500",
  "from-indigo-600 to-blue-600",
  "from-sky-600 to-sky-500",
  "from-sky-600 to-blue-500",
  "from-blue-500 to-indigo-500",
  "from-indigo-500 to-blue-600",
];

const ICON_OPTIONS = [
  "FileCheck", "FileText", "Landmark", "Receipt", "Building2", "Briefcase",
  "Rocket", "Building", "Calculator", "Users", "SearchCheck", "Lightbulb",
  "Shield", "Award", "CheckCircle", "Globe", "TrendingUp", "BarChart3",
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const cached = loadCache<Service[]>("services");
    if (cached && cached.length > 0) {
      setServices(cached);
      setLoading(false);
    }
    fetch("/api/data/services")
      .then((r) => r.json())
      .then((data) => {
        const svc = Array.isArray(data) ? data : [];
        setServices(svc);
        saveCache("services", svc);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    await fetch("/api/data/services", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(services),
    });
    setSaving(false);
    saveCache("services", services);
    setSuccess("Services saved! Live on website in ~60 seconds.");
    setTimeout(() => setSuccess(""), 5000);
  };

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: `service-${Date.now()}`,
        title: "New Service",
        description: "Service description goes here.",
        icon: "Star",
        gradient: GRADIENTS[prev.length % GRADIENTS.length],
      },
    ]);
  };

  const removeService = (index: number) => {
    setServices((prev) => prev.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof Service, value: string) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your service offerings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addService}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Service
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
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-100 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 text-slate-300 cursor-move">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => updateService(index, "title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Icon</label>
                  <select
                    value={service.icon}
                    onChange={(e) => updateService(index, "icon", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Gradient</label>
                  <select
                    value={service.gradient}
                    onChange={(e) => updateService(index, "gradient", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
                  >
                    {GRADIENTS.map((g) => (
                      <option key={g} value={g}>{g.replace("from-", "").replace("-600 to-", " → ").replace("-500", "").replace("-600", "")}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                  <textarea
                    value={service.description}
                    onChange={(e) => updateService(index, "description", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">ID (slug)</label>
                  <input
                    type="text"
                    value={service.id}
                    onChange={(e) => updateService(index, "id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => removeService(index)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No services yet</p>
          <button onClick={addService} className="text-blue-600 text-sm mt-2 hover:underline">
            Add your first service
          </button>
        </div>
      )}
    </div>
  );
}
