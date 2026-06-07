"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/ui/section-title";
import Badge from "@/components/ui/badge";
import { useBlogPosts } from "@/lib/admin/data-context";
import { Search, Calendar, Clock, ArrowRight, Sparkles, Link as LinkIcon, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function BlogPage() {
  const { t } = useLanguage();
  const blogPosts = useBlogPosts();
  const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchCategory = activeCategory === "All" || post.category === activeCategory;
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "7s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.blog.badge}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Latest Articles &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                Insights
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Stay informed with expert analysis on tax laws, compliance updates, and business strategies.
            </p>
          </motion.div>

          {/* Search & Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <div className="relative max-w-md mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder={t.blog.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-white/10 backdrop-blur-sm text-white/70 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="primary">{post.category}</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-3 text-xs text-white/70">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-4">{post.excerpt}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                        {t.blog.readMore} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-lg font-medium text-slate-700">{t.blog.noArticles}</p>
              <p className="text-sm text-slate-500 mt-1">{t.blog.noArticlesHint}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Managed Articles Section */}
      {(t.blog?.articles || []).length > 0 && (
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-blue-50/80 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-50/80 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              title={t.blog.latestInsights}
              subtitle={t.blog.insightsSubtitle}
            />
            <div className="mt-10 space-y-6">
              {(t.blog?.articles || []).map((article: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900">{article.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="primary">{article.category}</Badge>
                        {article.date && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {article.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {article.content && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{article.content}</p>
                  )}

                  {/* Important Points */}
                  {(article.importantPoints || []).length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Points:</h4>
                      <ul className="space-y-1.5">
                        {(article.importantPoints || []).map((point: string, pIdx: number) => (
                          <li key={pIdx} className="flex items-start gap-2 text-sm text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reference Links */}
                  {(article.links || []).length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reference Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {(article.links || []).map((link: any, lIdx: number) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 hover:text-blue-800 transition-all"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                            {link.label || link.url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
