"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ImagePlus } from "lucide-react";
import Link from "next/link";

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  published: boolean;
}

const CATEGORIES = ["GST", "Income Tax", "TDS", "ROC", "Registration", "General"];

export default function BlogEditor({ postId }: { postId?: number }) {
  const router = useRouter();
  const isEditing = !!postId;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "GST",
    author: "TaxEase Team",
    image: "",
    published: true,
  });

  useEffect(() => {
    if (postId) {
      fetch(`/api/blogs/${postId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && !data.error) {
            setForm({
              title: data.title || "",
              slug: data.slug || "",
              excerpt: data.excerpt || "",
              content: data.content || "",
              category: data.category || "GST",
              author: data.author || "TaxEase Team",
              image: data.image || "",
              published: data.published !== false,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Auto-generate slug from title
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = { ...form, slug };
    const readTime = `${Math.max(1, Math.ceil(form.content.length / 1000))} min read`;

    try {
      const res = isEditing
        ? await fetch(`/api/blogs/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, readTime }),
          })
        : await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, readTime }),
          });

      if (res.ok) {
        router.push("/admin/blogs");
      }
    } catch {
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("file", file);
      if (form.image) formData.append("oldUrl", form.image);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, image: data.url }));
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/blogs"
          className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditing ? "Edit Blog Post" : "New Blog Post"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isEditing ? "Update the post details below" : "Fill in the details for your new post"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  if (!isEditing) {
                    setForm((f) => ({
                      ...f,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                    }));
                  }
                }}
                placeholder="Enter post title"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-generated-from-title"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
              />
            </div>

            {/* Published */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <div className="flex items-center gap-3 h-[42px]">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                  className={`relative w-12 h-6 rounded-full transition-all ${
                    form.published ? "bg-green-500" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.published ? "translate-x-6" : ""
                    }`}
                  />
                </button>
                <span className="text-sm text-slate-600">
                  {form.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Featured Image</label>
              <button
                type="button"
                onClick={handleImageSelect}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-all"
              >
                <ImagePlus className="w-4 h-4" />
                {form.image ? "Change Image" : "Upload Image"}
              </button>
              {form.image && (
                <p className="text-xs text-slate-400 mt-1">{form.image}</p>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              placeholder="Brief description for the blog card..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Content (Markdown)</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your blog content in markdown..."
              rows={16}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm font-mono leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !form.title}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
          </button>
          <Link
            href="/admin/blogs"
            className="px-6 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
