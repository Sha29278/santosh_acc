"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  HelpCircle,
  Image,
  BadgePercent,
  Calendar,
  Settings,
  Star,
  FileEdit,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/ui/logo";
import { AdminProvider } from "@/lib/admin/admin-context";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/content", label: "Content Manager", icon: FileEdit },
  { href: "/admin/blogs", label: "Blog Posts", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/tax-slabs", label: "Tax Slabs", icon: BadgePercent },
  { href: "/admin/due-dates", label: "Due Dates", icon: Calendar },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/media", label: "Media", icon: Image },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
        } else if (pathname !== "/admin/login" && pathname !== "/admin/reset-password" && pathname !== "/admin/signup") {
          router.push("/admin/login");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [pathname, router]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // For login, signup, and reset-password pages, render without sidebar
  if (pathname === "/admin/login" || pathname === "/admin/reset-password" || pathname === "/admin/signup") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) return null;    return (
    <AdminProvider value={{ logout }}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 sm:w-72 lg:w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100">
              <Link href="/admin" className="flex items-center gap-2">
                <Logo tagline="Admin Panel" showTagline dark />
              </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="flex items-center justify-between px-3 sm:px-4 lg:px-8 h-14 sm:h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden lg:block" />
              <Link
                href="/"
                target="_blank"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View Site →
              </Link>
            </div>
          </header>

          {/* Page content */}
          <main className="p-3 sm:p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
