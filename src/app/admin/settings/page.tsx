"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Eye, EyeOff, Upload, Trash2 } from "lucide-react";

interface SiteConfig {
  adminUsername: string;
  adminPassword: string;
  adminEmail: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
}

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [config, setConfig] = useState<SiteConfig>({
    adminUsername: "",
    adminPassword: "••••••••",
    adminEmail: "",
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    logoUrl: "",
  });

  useEffect(() => {
    fetch("/api/site-config")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.siteName) setConfig(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File too large — maximum 2MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (config.logoUrl) formData.append("oldUrl", config.logoUrl);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      if (data.url) {
        setConfig((prev) => ({ ...prev, logoUrl: data.url }));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to upload logo. Try a different image.");
    }
    setUploadingLogo(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveLogo = async () => {
    const currentUrl = config.logoUrl;
    if (currentUrl) {
      // Try to delete the file from the server
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentUrl }),
        });
      } catch {}
    }
    setConfig((prev) => ({ ...prev, logoUrl: "" }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || "Settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof SiteConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Site Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage logo, site identity, contact info, and admin credentials</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      {success && (
        <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
          {success}
        </div>
      )}

      {/* Logo Upload Section */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Logo</h2>
        <p className="text-sm text-slate-500 mb-4">Upload your company logo — it will appear on the hero section, navbar, and footer.</p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200">
          {/* Logo Preview */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {config.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={config.logoUrl}
                alt="Site Logo"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                  <defs>
                    <linearGradient id="settings-logo-preview" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="#2563EB" />
                      <stop offset="1" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                  <rect width="40" height="40" rx="10" fill="url(#settings-logo-preview)" />
                  <text x="20" y="26" textAnchor="middle" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800">ATS</text>
                </svg>
                <span className="text-[10px] text-slate-400 mt-1">Default</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-slate-700">
              {config.logoUrl ? "Custom logo uploaded" : "No custom logo"}
            </p>
            <p className="text-xs text-slate-500">
              {config.logoUrl
                ? "Your uploaded logo will be used across the site."
                : "The default ATS logo will be used. Upload a PNG or JPG (max 2MB)."}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingLogo ? "Uploading..." : config.logoUrl ? "Replace Logo" : "Upload Logo"}
              </button>
              {config.logoUrl && (
                <button
                  onClick={handleRemoveLogo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Site Identity */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Site Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Name</label>
              <input
                type="text"
                value={config.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Site Description / Tagline</label>
              <input
                type="text"
                value={config.siteDescription}
                onChange={(e) => update("siteDescription", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Contact Email</label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
              <input
                type="text"
                value={config.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Admin Credentials */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Admin Credentials</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Username</label>
              <input
                type="text"
                value={config.adminUsername}
                onChange={(e) => update("adminUsername", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={config.adminEmail}
                onChange={(e) => update("adminEmail", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span className="text-xs text-slate-400 font-normal">(leave as dots to keep current)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={config.adminPassword}
                  onChange={(e) => update("adminPassword", e.target.value)}
                  className="w-full pr-10 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
