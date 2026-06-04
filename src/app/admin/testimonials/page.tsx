"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Star } from "lucide-react";
import { cachedFetch, saveCache } from "@/lib/admin/client-cache";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    cachedFetch<Testimonial[]>("testimonials", "/api/testimonials", [])
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    try {
      const res = await fetch("/api/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      const data = await res.json();
      if (data.success) {
        saveCache("testimonials", items);
        setSuccess(data.message || "Testimonials saved! Live on website in ~60 seconds.");
        setTimeout(() => setSuccess(""), 5000);
      }
    } catch {
      alert("Failed to save testimonials");
    } finally {
      setSaving(false);
    }
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        name: "New Client",
        role: "Business Owner",
        content: "Great service! Highly recommended.",
        rating: 5,
        initials: "NC",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof Testimonial, value: string | number) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        if (field === "name") updated.initials = generateInitials(value as string);
        return updated;
      })
    );
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-sm text-slate-500 mt-1">
            {items.length} testimonials — manage client reviews shown on the website
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Testimonial
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
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-100 p-5"
          >
            <div className="flex items-start gap-4">
              {/* Initials Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-white font-bold text-sm">
                  {item.initials || generateInitials(item.name)}
                </span>
              </div>

              <div className="flex-1 grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Role / Title</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateItem(index, "role", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Testimonial Content</label>
                  <textarea
                    value={item.content}
                    onChange={(e) => updateItem(index, "content", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Rating (1-5)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={item.rating}
                      onChange={(e) => updateItem(index, "rating", parseInt(e.target.value) || 5)}
                      className="w-20 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p className="font-medium">No testimonials yet</p>
          <button onClick={addItem} className="text-blue-600 text-sm mt-2 hover:underline">
            Add your first testimonial
          </button>
        </div>
      )}
    </div>
  );
}
