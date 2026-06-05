"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Logo from "@/components/ui/logo";
import { useSiteConfig } from "@/lib/use-site-config";

export default function Footer() {
  const { t } = useLanguage();
  const config = useSiteConfig();
  const phone = config.contactPhone || "+91 9613461462";
  const email = config.contactEmail || "info@acctaxsolutions.in";
  const address = config.address || "Fancy Ali, Jorhat, Assam - 785001";
  const siteName = config.siteName || "AccTax Solutions";
  const phoneHref = phone.replace(/\s+/g, "");

  const footerLinks = {
    services: [
      { href: "/services#gst-registration", label: t.footer.quickLinks.services.gstRegistration },
      { href: "/services#income-tax", label: t.footer.quickLinks.services.incomeTax },
      { href: "/services#tds", label: t.footer.quickLinks.services.tdsReturn },
      { href: "/services#company-registration", label: t.footer.quickLinks.services.companyRegistration },
      { href: "/services#msme-registration", label: t.footer.quickLinks.services.msmeRegistration },
    ],
    company: [
      { href: "/about", label: t.footer.quickLinks.company.aboutUs },
      { href: "/services", label: t.footer.quickLinks.company.services },
      { href: "/pricing", label: t.footer.quickLinks.company.pricing },
      { href: "/blog", label: t.footer.quickLinks.company.blog },
      { href: "/contact", label: t.footer.quickLinks.company.contactUs },
    ],
    support: [
      { href: "/privacy-policy", label: t.footer.quickLinks.support.privacyPolicy },
      { href: "/terms", label: t.footer.quickLinks.support.terms },
      { href: "/faq", label: t.footer.quickLinks.support.faq },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 inline-flex items-center gap-3">
              <Logo title={siteName} />
              {config.logoUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={config.logoUrl} alt="Company Logo" className="h-10 w-auto object-contain" />
              )}
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {t.footer.tagline}
            </p>
            <div className="space-y-3">
              <a href={`tel:${phoneHref}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-blue-400 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                {phone}
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-indigo-400 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                {email}
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-400 group">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-sky-400" />
                </div>
                <span className="pt-1.5">{address}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
              {t.footer.services}
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group">
                    <ChevronRight className="w-3 h-3 text-blue-400 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
              {t.footer.company}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group">
                    <ChevronRight className="w-3 h-3 text-blue-400 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-4">
              {t.footer.support}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group">
                    <ChevronRight className="w-3 h-3 text-blue-400 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} AccTax Solutions. {t.footer.allRightsReserved}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">                    {t.footer.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
