"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import { useLanguage } from "@/lib/i18n";
import { useSiteConfig } from "@/lib/use-site-config";

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
  const pathname = usePathname();
  const { t } = useLanguage();
  const config = useSiteConfig();

  const phone = config.contactPhone || "+91 9613461462";
  const siteName = config.siteName || "AccTax Solutions";
  const logoUrl = config.logoUrl || "";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const links = navLinks(t);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20 overflow-hidden">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            {logoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Company Logo" className="h-9 w-auto object-contain" />
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">{siteName}</span>
              </>
            ) : (
              <Logo title={siteName} />
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6 whitespace-nowrap">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors relative group whitespace-nowrap",
                    active
                      ? "text-white"
                      : "text-blue-200 hover:text-white"
                  )}
                >
                  {link.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                    active
                      ? "w-full bg-white/70"
                      : "w-0 group-hover:w-full bg-white/50"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="hidden xl:flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors whitespace-nowrap">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>
            <Link
              href="/contact"
              className="px-3 xl:px-5 py-2 xl:py-2.5 bg-white text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-all shadow-lg whitespace-nowrap"
            >
              {t.nav.bookConsultation}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all"
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
