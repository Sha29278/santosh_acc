"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBlogPosts } from "@/lib/admin/data-context";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, User, ArrowRight, Share2, ExternalLink, Send, MessageCircle, Sparkles } from "lucide-react";

// Simple markdown-like rendering for blog content
function renderContent(content?: string) {
  if (!content) return null;
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-8 mb-4">
          {block.replace("## ", "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="text-xl font-bold text-slate-900 mt-6 mb-3">
          {block.replace("### ", "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
          {items.map((item, j) => (
            <li key={j}>{item.replace("- ", "")}</li>
          ))}
        </ul>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      const items = block.split("\n").filter((l) => /^\d+\.\s/.test(l));
      return (
        <ol key={i} className="list-decimal pl-6 text-slate-600 space-y-2 mb-6">
          {items.map((item, j) => (
            <li key={j}>{item.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="text-slate-600 leading-relaxed mb-4">
        {block}
      </p>
    );
  });
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const blogPosts = useBlogPosts();
  const post = blogPosts.find((p: any) => p.slug === slug);
  const relatedPosts = blogPosts.filter((p: any) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h1>
          <p className="text-slate-600 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog">
            <Button variant="primary">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Article Header */}
      <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute top-10 right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <Badge variant="primary" className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/60">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {post.readTime}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Featured image */}
          {post.image ? (
            <div className="h-48 sm:h-64 md:h-80 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center relative shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.title}
                className={`w-full h-full object-cover ${post.image.startsWith("/uploads/default") ? "opacity-30" : ""}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {post.image.startsWith("/uploads/default") && (
                <span className="text-white/60 text-lg absolute pointer-events-none">Featured Image</span>
              )}
            </div>
          ) : (
            <div className="h-48 sm:h-64 md:h-80 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center shadow-xl">
              <span className="text-white/60 text-lg">Featured Image</span>
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed mb-6 font-medium">
              {post.excerpt}
            </p>

            {post.content ? (
              renderContent(post.content)
            ) : (
              <>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Key Highlights</h2>
                <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
                  <li>Comprehensive overview of the latest tax regulations and compliance requirements</li>
                  <li>Step-by-step guidance on documentation and filing procedures</li>
                  <li>Expert tips to avoid common mistakes and maximize tax benefits</li>
                  <li>Important deadlines and penalty information you need to know</li>
                </ul>
              </>
            )}
          </div>

          {/* Share section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share this article
              </p>
              <div className="flex gap-2">
                {[
                  { name: "LinkedIn", icon: ExternalLink, color: "hover:bg-blue-100 hover:text-blue-600" },
                  { name: "Twitter", icon: Send, color: "hover:bg-sky-100 hover:text-sky-600" },
                  { name: "WhatsApp", icon: MessageCircle, color: "hover:bg-emerald-100 hover:text-emerald-600" },
                ].map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      className={`flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium transition-all ${platform.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-xs font-medium text-blue-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Continue Reading
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Related Articles</h2>
              </div>
              <Link href="/blog" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 whitespace-nowrap">
                View All <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((related: any, i: number) => (
                <motion.div
                  key={related.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${related.slug}`}>
                    <div className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-600 relative">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)]" />
                        <div className="absolute top-3 left-3"><Badge variant="primary">{related.category}</Badge></div>
                      </div>
                      <div className="p-4 sm:p-5">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2 group-hover:gradient-text transition-all duration-300 line-clamp-2">
                          {related.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
