"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Briefcase,
  MessageSquare,
  HelpCircle,
  Image,
  ArrowRight,
  TrendingUp,
  Edit3,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    services: 0,
    faqs: 0,
    media: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/blogs").then((r) => r.json()),
      fetch("/api/data/services").then((r) => r.json()),
      fetch("/api/data/faqs").then((r) => r.json()),
      fetch("/api/upload").then((r) => r.json()),
    ]).then(([blogs, services, faqs, media]) => {
      setStats({
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        services: Array.isArray(services) ? services.length : 0,
        faqs: Array.isArray(faqs) ? faqs.length : 0,
        media: Array.isArray(media) ? media.length : 0,
      });
    });
  }, []);

  const cards = [
    {
      title: "Blog Posts",
      count: stats.blogs,
      icon: FileText,
      href: "/admin/blogs",
      gradient: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-200",
    },
    {
      title: "Services",
      count: stats.services,
      icon: Briefcase,
      href: "/admin/services",
      gradient: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-200",
    },
    {
      title: "FAQs",
      count: stats.faqs,
      icon: HelpCircle,
      href: "/admin/faqs",
      gradient: "from-sky-500 to-blue-600",
      shadow: "shadow-blue-200",
    },
    {
      title: "Media Files",
      count: stats.media,
      icon: Image,
      href: "/admin/media",
      gradient: "from-indigo-500 to-blue-600",
      shadow: "shadow-indigo-200",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome to the TaxEase admin panel</p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={card.href}>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{card.count}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{card.title}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">New Blog Post</p>
              <p className="text-xs text-slate-500">Create and publish</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/admin/media"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Upload Media</p>
              <p className="text-xs text-slate-500">Images and files</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">View Website</p>
              <p className="text-xs text-slate-500">See live changes</p>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
