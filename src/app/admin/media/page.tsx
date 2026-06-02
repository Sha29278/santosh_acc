"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Trash2, Copy, Check, ImageIcon } from "lucide-react";

export default function AdminMedia() {
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/upload")
      .then((r) => r.json())
      .then((data) => setMedia(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) {
      setMedia((prev) => [...prev, data.url]);
    }
    setUploading(false);
  };

  const handleDelete = async (url: string) => {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    setMedia((prev) => prev.filter((m) => m !== url));
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="text-sm text-slate-500 mt-1">{media.length} files</p>
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer shadow-lg shadow-blue-200">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No media files yet</p>
          <p className="text-sm text-slate-400 mt-1">Upload images to use across your site</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((url, i) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden"
            >
              <div className="aspect-square bg-slate-50 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23f1f5f9' width='100' height='100'/><text x='50' y='55' text-anchor='middle' fill='%2394a3b8' font-size='10'>Image</text></svg>";
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(url)}
                    className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100 transition-all"
                    title="Copy URL"
                  >
                    {copied === url ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(url)}
                    className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-500 truncate">{url.split("/").pop()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
