"use client";

import { useState, useEffect } from "react";import { Save, Layout, Navigation2, Info, Award, ListOrdered,
  DollarSign, FileText, HelpCircle, Mail, Calculator,
  Calendar, Plus, Trash2, ChevronDown,
} from "lucide-react";
import { loadCache, saveCache } from "@/lib/admin/client-cache";

interface ContentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

type TabKey = "all" | "hero" | "nav" | "footer" | "about" | "whyChooseUs" | "process" | "pricing" | "blog" | "faq" | "contact" | "taxCalculator" | "complianceCalendar" | "common" | "privacyPolicy" | "terms";

const Input = ({ label, value, onChange, multiline = false, rows = 2 }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; rows?: number }) => (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm" />
      )}
    </div>
  );

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", label: "All Data", icon: Layout },
  { key: "hero", label: "Hero Section", icon: Layout },
  { key: "nav", label: "Navigation", icon: Navigation2 },
  { key: "footer", label: "Footer", icon: Navigation2 },
  { key: "about", label: "About Page", icon: Info },
  { key: "whyChooseUs", label: "Why Choose Us", icon: Award },
  { key: "process", label: "Process Steps", icon: ListOrdered },
  { key: "pricing", label: "Pricing", icon: DollarSign },
  { key: "blog", label: "Blog Section", icon: FileText },
  { key: "faq", label: "FAQ Section", icon: HelpCircle },
  { key: "contact", label: "Contact", icon: Mail },
  { key: "taxCalculator", label: "Tax Calculator", icon: Calculator },
  { key: "complianceCalendar", label: "Compliance Calendar", icon: Calendar },
  { key: "common", label: "Common Text", icon: FileText },
  { key: "privacyPolicy", label: "Privacy Policy", icon: FileText },
  { key: "terms", label: "Terms & Conditions", icon: FileText },
];

export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [accordionOpen, setAccordionOpen] = useState<Record<string, boolean>>({});
  const [content, setContent] = useState<ContentData>({});

  const toggleAccordion = (section: string) => {
    setAccordionOpen((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const ALL_SECTIONS = ["hero", "nav", "footer", "about", "whyChooseUs", "process", "pricing", "blog", "faq", "contact", "taxCalculator", "complianceCalendar", "common", "privacyPolicy", "terms"];

  useEffect(() => {
    const cached = loadCache<ContentData>("site-content");
    if (cached && Object.keys(cached).length > 0) {
      setContent(cached);
      setLoading(false);
      return; // Don't fetch from API — stale data would overwrite cache
    }
    fetch("/api/site-content")
      .then((r) => r.json())
      .then((data) => { if (data) { setContent(data); saveCache("site-content", data); } })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (data.success) {
        saveCache("site-content", content);
        setSuccess(data.message || "Content saved! Live on website in ~60 seconds.");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.error || "Failed to save content. Please try again.");
        setTimeout(() => setError(""), 5000);
      }
    } catch {
      setError("Network error — could not save content");
      setTimeout(() => setError(""), 5000);
    } finally {
      setSaving(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (section: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateNested = (section: string, nested1: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [nested1]: { ...((prev[section] || {})[nested1] || {}), [field]: value },
      },
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateDeep = (section: string, nested1: string, nested2: string, field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [nested1]: {
          ...((prev[section] || {})[nested1] || {}),
          [nested2]: { ...((((prev[section] || {})[nested1] || {})[nested2]) || {}), [field]: value },
        },
      },
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateArrayItem = (section: string, arrayField: string, index: number, field: string, value: any) => {
    setContent((prev) => {
      const arr = [...((prev[section] || {})[arrayField] || [])];
      arr[index] = { ...(arr[index] || {}), [field]: value };
      return { ...prev, [section]: { ...(prev[section] || {}), [arrayField]: arr } };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addArrayItem = (section: string, arrayField: string, template: any) => {
    setContent((prev) => {
      const arr = [...((prev[section] || {})[arrayField] || []), template];
      return { ...prev, [section]: { ...(prev[section] || {}), [arrayField]: arr } };
    });
  };

  const removeArrayItem = (section: string, arrayField: string, index: number) => {
    setContent((prev) => {
      const arr = ((prev[section] || {})[arrayField] || []).filter((_: unknown, i: number) => i !== index);
      return { ...prev, [section]: { ...(prev[section] || {}), [arrayField]: arr } };
    });
  };

  const renderSection = (section: string, fields: [string, string, boolean?][]) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map(([key, label, multiline]) => (
        <div key={key} className={multiline ? "sm:col-span-2" : ""}>
          <Input label={label} value={(content[section] || {})[key] || ""}
            onChange={(v) => updateField(section, key, v)} multiline={multiline} rows={multiline ? 3 : 2} />
        </div>
      ))}
    </div>
  );

  const renderNestedSection = (section: string, nested: string, fields: [string, string, boolean?][]) => (
    <div className="grid sm:grid-cols-2 gap-4">
      {fields.map(([key, label, multiline]) => (
        <div key={key} className={multiline ? "sm:col-span-2" : ""}>
          <Input label={label} value={((content[section] || {})[nested] || {})[key] || ""}
            onChange={(v) => updateNested(section, nested, key, v)} multiline={multiline} rows={multiline ? 3 : 2} />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Manager</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all text content across the website</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All Content"}
        </button>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">{success}</div>
      )}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-xl text-sm font-medium">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-1 mb-6 pb-2 scrollbar-thin">
        {TABS.map((tab) => {
          const Icon = tab.icon as React.ComponentType<{ className?: string }>;
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">
            {TABS.find((t) => t.key === activeTab)?.label || "Content"}
          </h2>
          <span className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
            {activeTab}
          </span>
        </div>
        <div className="p-5 space-y-6">
          {/* ========= ALL DATA TAB ========= */}
          {activeTab === "all" && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500 mb-4">All content sections in one view. Click a section to expand and edit.</p>
              {ALL_SECTIONS.map((sectionKey) => {
                const sectionData = content[sectionKey];
                const isOpen = accordionOpen[sectionKey] !== false;
                return (
                  <div key={sectionKey} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleAccordion(sectionKey)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                    >
                      <span className="text-sm font-semibold text-slate-700 capitalize">
                        {sectionKey.replace(/([A-Z])/g, ' $1').trim()} Section
                      </span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 space-y-4">
                        {sectionData && typeof sectionData === 'object' && !Array.isArray(sectionData)
                          ? Object.entries(sectionData).map(([fieldKey, fieldValue]) => {
                              if (Array.isArray(fieldValue)) {
                                if (fieldValue.length > 0 && typeof fieldValue[0] === 'object') {
                                  // Array of objects (e.g., items, steps, highlights)
                                  return (
                                    <div key={fieldKey}>
                                      <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                        {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                                      </label>
                                      {(fieldValue as any[]).map((item: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 rounded-lg p-3 mb-2 space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-slate-400">Item {idx + 1}</span>
                                            <button onClick={() => {
                                              const arr = [...((content[sectionKey] || {})[fieldKey] || [])];
                                              arr.splice(idx, 1);
                                              updateField(sectionKey, fieldKey, arr);
                                            }} className="p-0.5 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                                          </div>
                                          {Object.entries(item).map(([k, v]) => (
                                            <div key={k}>
                                              <Input
                                                label={k.replace(/([A-Z])/g, ' $1').trim()}
                                                value={String(v || '')}
                                                onChange={(newVal) => {
                                                  const arr = [...((content[sectionKey] || {})[fieldKey] || [])];
                                                  arr[idx] = { ...arr[idx], [k]: newVal };
                                                  updateField(sectionKey, fieldKey, arr);
                                                }}
                                                multiline={typeof v === 'string' && v.length > 80}
                                                rows={3}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      ))}
                                      <button onClick={() => {
                                        const arr = [...((content[sectionKey] || {})[fieldKey] || [])];
                                        const template = fieldValue.length > 0
                                          ? Object.fromEntries(Object.entries(fieldValue[0]).map(([k]) => [k, '']))
                                          : {};
                                        arr.push(template);
                                        updateField(sectionKey, fieldKey, arr);
                                      }}
                                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1">
                                        <Plus className="w-3 h-3" /> Add {fieldKey.slice(0, -1)}
                                      </button>
                                    </div>
                                  );
                                } else {
                                  // Array of strings
                                  return (
                                    <div key={fieldKey}>
                                      <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                        {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                                      </label>
                                      {(fieldValue as string[]).map((item: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2 mb-2">
                                          <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => {
                                              const arr = [...((content[sectionKey] || {})[fieldKey] || [])];
                                              arr[idx] = e.target.value;
                                              updateField(sectionKey, fieldKey, arr);
                                            }}
                                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                                          />
                                          <button onClick={() => {
                                            const arr = [...((content[sectionKey] || {})[fieldKey] || [])];
                                            arr.splice(idx, 1);
                                            updateField(sectionKey, fieldKey, arr);
                                          }} className="p-1 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      ))}
                                      <button onClick={() => {
                                        const arr = [...((content[sectionKey] || {})[fieldKey] || []), ''];
                                        updateField(sectionKey, fieldKey, arr);
                                      }}
                                        className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1">
                                        <Plus className="w-3 h-3" /> Add Item
                                      </button>
                                    </div>
                                  );
                                }
                              } else if (typeof fieldValue === 'object' && fieldValue !== null) {
                                // Nested object (e.g., form, gst, incomeTax, values, team, quickLinks)
                                return (
                                  <div key={fieldKey}>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                      {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                                    </label>
                                    <div className="bg-slate-50 rounded-lg p-3 space-y-3">
                                      {Object.entries(fieldValue as Record<string, any>).map(([nestedKey, nestedValue]) => {
                                        if (Array.isArray(nestedValue)) {
                                          // Array within nested object (e.g., values.items)
                                          return (
                                            <div key={nestedKey}>
                                              <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">
                                                {nestedKey.replace(/([A-Z])/g, ' $1').trim()}
                                              </label>
                                              {(nestedValue as any[]).map((item: any, idx: number) => (
                                                <div key={idx} className="bg-white rounded-lg p-2 mb-2 space-y-2 border border-slate-100">
                                                  <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-semibold text-slate-400">Item {idx + 1}</span>
                                                    <button onClick={() => {
                                                      const parent = { ...((content[sectionKey] || {})[fieldKey] || {}) };
                                                      const arr = [...((parent[nestedKey] as any[]) || [])];
                                                      arr.splice(idx, 1);
                                                      updateField(sectionKey, fieldKey, { ...parent, [nestedKey]: arr });
                                                    }} className="p-0.5 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                                                  </div>
                                                  {Object.entries(item).map(([k, v]) => (
                                                    <div key={k}>
                                                      <Input
                                                        label={k.replace(/([A-Z])/g, ' $1').trim()}
                                                        value={String(v || '')}
                                                        onChange={(newVal) => {
                                                          const parent = { ...((content[sectionKey] || {})[fieldKey] || {}) };
                                                          const arr = [...((parent[nestedKey] as any[]) || [])];
                                                          arr[idx] = { ...arr[idx], [k]: newVal };
                                                          updateField(sectionKey, fieldKey, { ...parent, [nestedKey]: arr });
                                                        }}
                                                        multiline={typeof v === 'string' && v.length > 80}
                                                        rows={3}
                                                      />
                                                    </div>
                                                  ))}
                                                </div>
                                              ))}
                                              <button onClick={() => {
                                                const parent = { ...((content[sectionKey] || {})[fieldKey] || {}) };
                                                const arr = [...((parent[nestedKey] as any[]) || [])];
                                                const template = (nestedValue as any[]).length > 0
                                                  ? Object.fromEntries(Object.entries((nestedValue as any[])[0]).map(([k]) => [k, '']))
                                                  : {};
                                                arr.push(template);
                                                updateField(sectionKey, fieldKey, { ...parent, [nestedKey]: arr });
                                              }}
                                                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-1">
                                                <Plus className="w-3 h-3" /> Add {nestedKey.slice(0, -1)}
                                              </button>
                                            </div>
                                          );
                                        } else {
                                          return (
                                            <Input
                                              key={nestedKey}
                                              label={nestedKey.replace(/([A-Z])/g, ' $1').trim()}
                                              value={String(nestedValue || '')}
                                              onChange={(newVal) => updateNested(sectionKey, fieldKey, nestedKey, newVal)}
                                              multiline={typeof nestedValue === 'string' && nestedValue.length > 80}
                                              rows={3}
                                            />
                                          );
                                        }
                                      })}
                                    </div>
                                  </div>
                                );
                              } else {
                                // Simple string value
                                const strVal = String(fieldValue || '');
                                return (
                                  <Input
                                    key={fieldKey}
                                    label={fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                                    value={strVal}
                                    onChange={(v) => updateField(sectionKey, fieldKey, v)}
                                    multiline={strVal.length > 80}
                                    rows={3}
                                  />
                                );
                              }
                            })
                          : (
                            <div className="text-sm text-slate-400 py-4 text-center">No data in this section</div>
                          )
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ========= HERO TAB ========= */}
          {activeTab === "hero" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Hero Banner Text</h3>
              {renderSection("hero", [
                ["trustBadge", "Trust Badge", false],
                ["title", "Title (before highlight)", false],
                ["titleHighlight", "Title Highlight (gradient)", false],
                ["subtitle", "Subtitle", true],
                ["ctaPrimary", "Primary CTA Button", false],
                ["ctaSecondary", "Secondary CTA Button", false],
              ])}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Hero Statistics</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {["Years", "Clients", "Accuracy"].map((stat) => {
                    const key = `stat${stat}`;
                    const labelKey = `stat${stat}Label`;
                    return (
                      <div key={stat} className="bg-slate-50 rounded-xl p-4 space-y-2">
                        <Input label={`${stat} Value`} value={(content.hero || {})[key] || ""}
                          onChange={(v) => updateField("hero", key, v)} />
                        <Input label={`${stat} Label`} value={(content.hero || {})[labelKey] || ""}
                          onChange={(v) => updateField("hero", labelKey, v)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ========= NAV TAB ========= */}
          {activeTab === "nav" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Navigation Menu Labels</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["home", "about", "services", "taxCalculator", "incomeTaxCalculator", "pricing", "blog", "contact"].map((key) => (
                  <Input key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={(content.nav || {})[key] || ""}
                    onChange={(v) => updateField("nav", key, v)} />
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Extra Nav Items</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Book Consultation" value={(content.nav || {}).bookConsultation || ""}
                    onChange={(v) => updateField("nav", "bookConsultation", v)} />
                  <Input label="Phone Number" value={(content.nav || {}).phone || ""}
                    onChange={(v) => updateField("nav", "phone", v)} />
                </div>
              </div>
            </>
          )}

          {/* ========= FOOTER TAB ========= */}
          {activeTab === "footer" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Footer Text</h3>
              <div className="space-y-4">
                <Input label="Tagline" value={(content.footer || {}).tagline || ""}
                  onChange={(v) => updateField("footer", "tagline", v)} multiline rows={2} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {["services", "company", "support", "privacyPolicy", "termsOfService", "allRightsReserved"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={(content.footer || {})[key] || ""}
                      onChange={(v) => updateField("footer", key, v)} />
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-700">Quick Links — Services</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["gstRegistration", "incomeTax", "tdsReturn", "companyRegistration", "msmeRegistration"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={((content.footer || {}).quickLinks?.services || {})[key] || ""}
                      onChange={(v) => updateDeep("footer", "quickLinks", "services", key, v)} />
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Quick Links — Company</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["aboutUs", "services", "pricing", "blog", "contactUs"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={((content.footer || {}).quickLinks?.company || {})[key] || ""}
                      onChange={(v) => updateDeep("footer", "quickLinks", "company", key, v)} />
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Quick Links — Support</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["privacyPolicy", "terms", "faq"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={((content.footer || {}).quickLinks?.support || {})[key] || ""}
                      onChange={(v) => updateDeep("footer", "quickLinks", "support", key, v)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========= ABOUT TAB ========= */}
          {activeTab === "about" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Page Headers</h3>
              {renderSection("about", [
                ["badge", "Badge", false],
                ["title", "Title", false],
                ["titleHighlight", "Title Highlight", false],
                ["subtitle", "Subtitle", true],
                ["mission", "Mission Statement", true],
              ])}

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Core Values</h3>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Section Title" value={(content.about || {}).values?.title || ""}
                      onChange={(v) => updateNested("about", "values", "title", v)} />
                    <Input label="Section Subtitle" value={(content.about || {}).values?.subtitle || ""}
                      onChange={(v) => updateNested("about", "values", "subtitle", v)} />
                  </div>
                  {(content.about?.values?.items || []).map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Value {i + 1}</span>
                        <button onClick={() => {
                          const vals = { ...((content.about || {}).values || {}) };
                          const items = [...(vals.items || [])];
                          items.splice(i, 1);
                          updateField("about", "values", { ...vals, items });
                        }} className="p-1 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Input label="Title" value={item.title || ""}
                          onChange={(v) => {
                            const vals = { ...((content.about || {}).values || {}) };
                            const items = [...(vals.items || [])];
                            items[i] = { ...items[i], title: v };
                            updateField("about", "values", { ...vals, items });
                          }} />
                        <Input label="Description" value={item.desc || ""}
                          onChange={(v) => {
                            const vals = { ...((content.about || {}).values || {}) };
                            const items = [...(vals.items || [])];
                            items[i] = { ...items[i], desc: v };
                            updateField("about", "values", { ...vals, items });
                          }} multiline rows={2} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => {
                    const vals = { ...((content.about || {}).values || {}) };
                    const items = [...(vals.items || []), { title: "New Value", desc: "Description" }];
                    updateField("about", "values", { ...vals, items });
                  }}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                    <Plus className="w-3.5 h-3.5" /> Add Value
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Team Section</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="Badge" value={(content.about || {}).team?.badge || ""}
                    onChange={(v) => updateNested("about", "team", "badge", v)} />
                  <Input label="Title" value={(content.about || {}).team?.title || ""}
                    onChange={(v) => updateNested("about", "team", "title", v)} />
                </div>
                <div className="mt-3">
                  <Input label="Subtitle" value={(content.about || {}).team?.subtitle || ""}
                    onChange={(v) => updateNested("about", "team", "subtitle", v)} multiline rows={2} />
                </div>
                <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(content.about?.team?.highlights || []).map((item: any, i: number) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400">Highlight {i + 1}</span>
                        <button onClick={() => {
                          const arr = [...((content.about?.team?.highlights) || [])];
                          arr.splice(i, 1);
                          updateField("about", "team", { ...((content.about || {}).team || {}), highlights: arr });
                        }} className="p-0.5 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
                      </div>
                      <Input label="Number" value={item.number || ""}
                        onChange={(v) => {
                          const arr = [...((content.about?.team?.highlights) || [])];
                          arr[i] = { ...arr[i], number: v };
                          updateField("about", "team", { ...((content.about || {}).team || {}), highlights: arr });
                        }} />
                      <Input label="Label" value={item.label || ""}
                        onChange={(v) => {
                          const arr = [...((content.about?.team?.highlights) || [])];
                          arr[i] = { ...arr[i], label: v };
                          updateField("about", "team", { ...((content.about || {}).team || {}), highlights: arr });
                        }} />
                    </div>
                  ))}
                  <button onClick={() => {
                    const arr = [...((content.about?.team?.highlights) || []), { number: "New", label: "Highlight label" }];
                    updateField("about", "team", { ...((content.about || {}).team || {}), highlights: arr });
                  }}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-3">
                    <Plus className="w-3.5 h-3.5" /> Add Highlight
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ========= WHY CHOOSE US TAB ========= */}
          {activeTab === "whyChooseUs" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Section Headers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "subtitle"].map((key) => (
                  <div key={key} className={key === "subtitle" ? "sm:col-span-2" : ""}>
                    <Input label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={(content.whyChooseUs || {})[key] || ""}
                      onChange={(v) => updateField("whyChooseUs", key, v)} multiline={key === "subtitle"} />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Feature Cards</h3>
                {(content.whyChooseUs?.items || []).map((item: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Card {i + 1}</span>
                      <button onClick={() => removeArrayItem("whyChooseUs", "items", i)}
                        className="p-1 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input label="Title" value={item.title || ""}
                        onChange={(v) => updateArrayItem("whyChooseUs", "items", i, "title", v)} />
                      <Input label="Stat" value={item.stat || ""}
                        onChange={(v) => updateArrayItem("whyChooseUs", "items", i, "stat", v)} />
                      <Input label="Suffix" value={item.suffix || ""}
                        onChange={(v) => updateArrayItem("whyChooseUs", "items", i, "suffix", v)} />
                      <Input label="Description" value={item.description || ""}
                        onChange={(v) => updateArrayItem("whyChooseUs", "items", i, "description", v)} multiline rows={2} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem("whyChooseUs", "items", { title: "New Feature", description: "Description", stat: "100%", suffix: "Label" })}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                  <Plus className="w-3.5 h-3.5" /> Add Card
                </button>
              </div>
            </>
          )}

          {/* ========= PROCESS TAB ========= */}
          {activeTab === "process" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Section Headers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "subtitle"].map((key) => (
                  <div key={key} className={key === "subtitle" ? "sm:col-span-2" : ""}>
                    <Input label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={(content.process || {})[key] || ""}
                      onChange={(v) => updateField("process", key, v)} multiline={key === "subtitle"} />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Steps</h3>
                {(content.process?.steps || []).map((step: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Step {i + 1}</span>
                      <button onClick={() => removeArrayItem("process", "steps", i)}
                        className="p-1 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input label="Title" value={step.title || ""}
                        onChange={(v) => updateArrayItem("process", "steps", i, "title", v)} />
                      <Input label="Description" value={step.description || ""}
                        onChange={(v) => updateArrayItem("process", "steps", i, "description", v)} />
                    </div>
                  </div>
                ))}
                <button onClick={() => addArrayItem("process", "steps", { title: "New Step", description: "Description" })}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                  <Plus className="w-3.5 h-3.5" /> Add Step
                </button>
              </div>
            </>
          )}

          {/* ========= PRICING TAB ========= */}
          {activeTab === "pricing" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Section Headers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "subtitle", "monthly", "yearly", "yourIncome", "enterIncome", "recommended", "mostPopular", "getStarted", "incomeTag"].map((key) => (
                  <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    value={(content.pricing || {})[key] || ""}
                    onChange={(v) => updateField("pricing", key, v)} multiline={["subtitle", "yourIncome"].includes(key)} />
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-700">Compare Plans Section</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {["comparePlans", "compareSubtitle", "feature", "customPlan", "customSubtitle", "contactTeam"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={(content.pricing || {})[key] || ""}
                      onChange={(v) => updateField("pricing", key, v)} />
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Plan Features (default list)</h3>
                {((content.pricing || {}).defaultFeatures || []).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const features = [...((content.pricing || {}).defaultFeatures || [])];
                        features[i] = e.target.value;
                        updateField("pricing", "defaultFeatures", features);
                      }}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                    />
                    <button onClick={() => {
                      const features = [...((content.pricing || {}).defaultFeatures || [])];
                      features.splice(i, 1);
                      updateField("pricing", "defaultFeatures", features);
                    }} className="p-1.5 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => {
                  const features = [...((content.pricing || {}).defaultFeatures || []), "New feature"];
                  updateField("pricing", "defaultFeatures", features);
                }}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                  <Plus className="w-3.5 h-3.5" /> Add Feature
                </button>
              </div>
            </>
          )}

          {/* ========= BLOG TAB ========= */}
          {activeTab === "blog" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Section Headers & Labels</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "subtitle", "latestInsights", "insightsSubtitle"].map((key) => (
                  <div key={key} className={["subtitle", "insightsSubtitle"].includes(key) ? "sm:col-span-2" : ""}>
                    <Input label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={(content.blog || {})[key] || ""}
                      onChange={(v) => updateField("blog", key, v)} multiline={["subtitle", "insightsSubtitle"].includes(key)} />
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["searchPlaceholder", "readMore", "viewAll", "noArticles", "noArticlesHint"].map((key) => (
                  <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    value={(content.blog || {})[key] || ""}
                    onChange={(v) => updateField("blog", key, v)} />
                ))}
              </div>
            </>
          )}

          {/* ========= FAQ TAB ========= */}
          {activeTab === "faq" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Section Headers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "subtitle", "searchPlaceholder", "noResults"].map((key) => (
                  <div key={key} className={["subtitle"].includes(key) ? "sm:col-span-2" : ""}>
                    <Input label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={(content.faq || {})[key] || ""}
                      onChange={(v) => updateField("faq", key, v)} multiline={["subtitle"].includes(key)} />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">FAQ Items (Questions & Answers)</h3>
                {((content.faq || {}).items || []).map((item: any, i: number) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Question {i + 1}</span>
                      <button onClick={() => {
                        const items = [...((content.faq || {}).items || [])];
                        items.splice(i, 1);
                        updateField("faq", "items", items);
                      }} className="p-1 rounded text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <Input label="Question" value={item.question || ""}
                      onChange={(v) => {
                        const items = [...((content.faq || {}).items || [])];
                        items[i] = { ...items[i], question: v };
                        updateField("faq", "items", items);
                      }} />
                    <Input label="Answer" value={item.answer || ""}
                      onChange={(v) => {
                        const items = [...((content.faq || {}).items || [])];
                        items[i] = { ...items[i], answer: v };
                        updateField("faq", "items", items);
                      }} multiline rows={3} />
                  </div>
                ))}
                <button onClick={() => {
                  const items = [...((content.faq || {}).items || []), { question: "New Question?", answer: "Answer here." }];
                  updateField("faq", "items", items);
                }}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>
            </>
          )}

          {/* ========= CONTACT TAB ========= */}
          {activeTab === "contact" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Section Headers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "subtitle"].map((key) => (
                  <div key={key} className={key === "subtitle" ? "sm:col-span-2" : ""}>
                    <Input label={key.charAt(0).toUpperCase() + key.slice(1)} value={(content.contact || {})[key] || ""}
                      onChange={(v) => updateField("contact", key, v)} multiline={key === "subtitle"} />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Contact Form Labels</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["fullName", "email", "phone", "serviceNeeded", "selectService", "message", "sendMessage", "thankYou", "thankYouMessage"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={((content.contact || {}).form || {})[key] || ""}
                      onChange={(v) => updateNested("contact", "form", key, v)} />
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Contact Info Labels</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {["callUs", "emailUs", "visitUs", "workingHours", "replyTime", "byAppointment", "getDirections", "quickChat", "quickChatDesc", "chatOnWhatsApp"].map((key) => (
                    <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={(content.contact || {})[key] || ""}
                      onChange={(v) => updateField("contact", key, v)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========= TAX CALCULATOR TAB ========= */}
          {activeTab === "taxCalculator" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Section Headers</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {["badge", "title", "titleHighlight", "subtitle", "gstTab", "incomeTaxTab"].map((key) => (
                  <div key={key} className={key === "subtitle" ? "sm:col-span-2" : ""}>
                    <Input label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={(content.taxCalculator || {})[key] || ""}
                      onChange={(v) => updateField("taxCalculator", key, v)} multiline={key === "subtitle"} />
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">GST Calculator Labels</h3>
                {renderNestedSection("taxCalculator", "gst", [
                  ["title", "Title"], ["enterDetails", "Enter Details"], ["amount", "Amount Label"],
                  ["enterAmount", "Amount Placeholder"], ["gstRate", "GST Rate"], ["taxType", "Tax Type"],
                  ["exclusive", "Exclusive"], ["inclusive", "Inclusive"],
                  ["exclusiveHint", "Exclusive Hint"], ["inclusiveHint", "Inclusive Hint"],
                  ["transactionType", "Transaction Type"], ["intraState", "Intra-state"], ["interState", "Inter-state"],
                  ["intraStateHint", "Intra-state Hint"], ["interStateHint", "Inter-state Hint"],
                  ["calculate", "Calculate Button"], ["noResults", "No Results"], ["noResultsHint", "No Results Hint"],
                  ["totalAmount", "Total Amount"], ["taxableValue", "Taxable Value"],
                  ["totalGst", "Total GST"], ["grandTotal", "Grand Total"],
                  ["copyResult", "Copy Result"], ["copied", "Copied Confirmation"],
                  ["understandingGst", "Understanding GST Heading"],
                  ["gstHowTitle", "How GST Works Title"], ["gstHowSubtitle", "How GST Works Subtitle"],
                  ["cgstSgstTitle", "CGST/SGST Title"], ["cgstSgstDesc", "CGST/SGST Description"],
                  ["igstTitle", "IGST Title"], ["igstDesc", "IGST Description"],
                ])}
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Income Tax Calculator Labels</h3>
                {renderNestedSection("taxCalculator", "incomeTax", [
                  ["title", "Title"], ["incomeDetails", "Income Details"],
                  ["annualIncome", "Annual Income Label"], ["enterIncome", "Income Placeholder"],
                  ["taxRegime", "Tax Regime"], ["newRegime", "New Regime"], ["oldRegime", "Old Regime"],
                  ["newRegimeHint", "New Regime Hint"], ["oldRegimeHint", "Old Regime Hint"],
                  ["deductions", "Deductions"], ["calculate", "Calculate Button"],
                  ["noResults", "No Results"], ["noResultsHint", "No Results Hint"],
                  ["totalTaxPayable", "Total Tax"], ["effectiveRate", "Effective Rate"],
                  ["grossIncome", "Gross Income"], ["standardDeduction", "Standard Deduction"],
                  ["otherDeductions", "Other Deductions"], ["taxableIncome", "Taxable Income"],
                  ["slabCalculation", "Slab Calculation"], ["taxBeforeRebate", "Tax Before Rebate"],
                  ["rebate", "Section 87A Rebate"], ["taxAfterRebate", "Tax After Rebate"],
                  ["cess", "Cess (4%)"],
                ])}
              </div>
            </>
          )}

          {/* ========= COMPLIANCE CALENDAR TAB ========= */}
          {activeTab === "complianceCalendar" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["badge", "Badge"], ["title", "Title"], ["subtitle", "Subtitle"],
                ["sync", "Sync Button"], ["syncing", "Syncing Text"], ["lastSynced", "Last Synced"],
                ["total", "Total Label"], ["overdue", "Overdue Label"],
                ["dueThisWeek", "Due This Week"], ["dueThisMonth", "Due This Month"],
                ["allDates", "All Dates"], ["gst", "GST Tab"], ["incomeTax", "Income Tax Tab"],
                ["noDates", "No Dates Text"], ["showAll", "Show All"], ["showLess", "Show Less"],
                ["getReminders", "Get Reminders Title"], ["getRemindersDesc", "Get Reminders Description"],
                ["subscribe", "Subscribe"], ["remindersActive", "Reminders Active"],
                ["unsubscribe", "Unsubscribe"], ["fileNow", "File Now"], ["close", "Close"],
                ["setReminder", "Set Reminder"], ["reminderSet", "Reminder Set"],
                ["removeReminder", "Remove Reminder"], ["dueToday", "Due Today"],
                ["daysLeft", "Days Left"], ["overdue_label", "Overdue Label"],
                ["gstTitle", "GST Section Title"], ["gstSubtitle", "GST Section Subtitle"],
                ["incomeTaxTitle", "Income Tax Section Title"], ["incomeTaxSubtitle", "Income Tax Section Subtitle"],
                ["viewAllGst", "View All GST"], ["viewAllIt", "View All Income Tax"],
                ["addDatesHint", "Add Dates Hint"], ["upcomingCount", "Upcoming Count Template"],
                ["dataSourcedFrom", "Data Source"], ["timeRemaining", "Time Remaining"],
                ["dueDateLabel", "Due Date Label"], ["categoryLabel", "Category Label"],
                ["formLabel", "Form Label"], ["statusLabel", "Status Label"],
              ].map(([key, label]) => (
                <div key={key} className={["subtitle", "getRemindersDesc"].includes(key) ? "sm:col-span-2" : ""}>
                  <Input label={label} value={(content.complianceCalendar || {})[key] || ""}
                    onChange={(v) => updateField("complianceCalendar", key, v)}
                    multiline={["subtitle", "subtitle", "getRemindersDesc"].includes(key)} />
                </div>
              ))}
            </div>
          )}

          {/* ========= PRIVACY POLICY TAB ========= */}
          {activeTab === "privacyPolicy" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Page Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Title" value={(content.privacyPolicy || {}).title || ""}
                  onChange={(v) => updateField("privacyPolicy", "title", v)} />
                <Input label="Last Updated" value={(content.privacyPolicy || {}).lastUpdated || ""}
                  onChange={(v) => updateField("privacyPolicy", "lastUpdated", v)} />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Page Content</h3>
                <Input label="Content" value={(content.privacyPolicy || {}).content || ""}
                  onChange={(v) => updateField("privacyPolicy", "content", v)} multiline rows={16} />
                <p className="text-xs text-slate-400 mt-2">Edit the Privacy Policy text above. Each paragraph should be separated by a blank line.</p>
              </div>
            </>
          )}

          {/* ========= TERMS & CONDITIONS TAB ========= */}
          {activeTab === "terms" && (
            <>
              <h3 className="text-sm font-semibold text-slate-700">Page Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Title" value={(content.terms || {}).title || ""}
                  onChange={(v) => updateField("terms", "title", v)} />
                <Input label="Last Updated" value={(content.terms || {}).lastUpdated || ""}
                  onChange={(v) => updateField("terms", "lastUpdated", v)} />
              </div>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Page Content</h3>
                <Input label="Content" value={(content.terms || {}).content || ""}
                  onChange={(v) => updateField("terms", "content", v)} multiline rows={16} />
                <p className="text-xs text-slate-400 mt-2">Edit the Terms & Conditions text above.</p>
              </div>
            </>
          )}

          {/* ========= COMMON TAB ========= */}
          {activeTab === "common" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["loading", "error", "search", "noResults", "viewAll", "readMore", "getStarted", "learnMore", "submit", "cancel", "save", "delete", "edit", "back", "next", "previous"].map((key) => (
                <Input key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  value={(content.common || {})[key] || ""}
                  onChange={(v) => updateField("common", key, v)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
