"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionTitle from "@/components/ui/section-title";
import Badge from "@/components/ui/badge";
import { useBlogPosts } from "@/lib/admin/data-context";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const cardGradients = [
  "from-blue-600 via-indigo-500 to-sky-500",
  "from-blue-500 via-sky-500 to-indigo-500",
  "from-sky-500 via-blue-600 to-indigo-600",
];

export default function BlogSection() {
  const { t } = useLanguage();
  const blogPosts = useBlogPosts();
  const featured = blogPosts.slice(0, 3);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.blog.badge}
          title={t.blog.title}
          subtitle={t.blog.subtitle}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featured.map((post, index) => (
            <motion.div
              key={post.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Card gradient header */}
                  <div className={`h-36 sm:h-48 bg-gradient-to-br ${cardGradients[index]} relative overflow-hidden`}>
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 shimmer" />
                    <div className="absolute top-4 left-4">
                      <Badge variant={index === 0 ? "primary" : index === 1 ? "secondary" : "info"}>{post.category}</Badge>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:gradient-text transition-all line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-400" />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium hover:gap-3 transition-all"
          >
            {t.blog.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
