"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/language-switcher";

const navLinks = (t: ReturnType<typeof useLanguage>["t"]) => [
  { href: "/", label: t.nav.home },
  { href: "/about", label: t.nav.about },
  { href: "/services", label: t.nav.services },
  { href: "/tax-calculator", label: t.nav.taxCalculator },
  { href: "/income-tax-calculator", label: t.nav.incomeTaxCalculator },
  { href: "/pricing", label: t.nav.pricing },
  { href: "/blog", label: t.nav.blog },
  { href: "/contact", label: t.nav.contact },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const isHomePage = pathname === "/";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  // On non-home pages, the navbar should always be solid white (no transparent phase)
  // On the home page, it starts transparent and becomes solid on scroll
  const showSolid = !isHomePage || scrolled;

  // Fix the navLinks to include t as a dependency
  const links = navLinks(t);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        showSolid
          ? "bg-white/80 backdrop-blur-xl border-b border-blue-100/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg animated-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xl font-bold whitespace-nowrap">
              <span className={cn(showSolid ? "text-slate-900" : "text-white")}>Tax</span>
              <span className="gradient-text">Ease</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative group",
                    active
                      ? showSolid
                        ? "text-blue-600"
                        : "text-white"
                      : showSolid
                        ? "text-slate-800 hover:text-blue-600"
                        : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                    active
                      ? "w-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-indigo-500",
                    showSolid ? "" : active ? "bg-white/60" : "bg-white/60"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Desktop Language + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher className={showSolid ? "border-blue-200 text-slate-600 hover:bg-blue-50" : "border-white/20 text-white/70 hover:bg-white/10"} />
            <a href="tel:+919999999999" className={cn(
              "flex items-center gap-2 text-sm transition-colors",
              showSolid ? "text-slate-800 hover:text-blue-600" : "text-white/70 hover:text-white"
            )}>
              <Phone className="w-4 h-4" />
              <span>+91 99999 99999</span>
            </a>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
            >
              {t.nav.bookConsultation}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-all",
              showSolid ? "text-slate-800 hover:bg-gray-100" : "text-white/80 hover:bg-white/10"
            )}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200"
          >
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
              <div className="px-3 sm:px-4">
                <LanguageSwitcher variant="dropdown" />
              </div>
              {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 sm:px-4 py-2.5 sm:py-2 text-sm font-medium rounded-lg transition-all",
                    active
                      ?                "text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 font-semibold"
                      : "text-slate-800 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium text-center hover:from-blue-700 hover:to-indigo-700"
              >
                {t.nav.bookConsultation}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
