"use client";

import { motion } from "framer-motion";
import ContactSection from "@/components/sections/contact-section";
import SectionTitle from "@/components/ui/section-title";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, ExternalLink, Sparkles, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useSiteConfig } from "@/lib/use-site-config";

export default function ContactPage() {
  const { t } = useLanguage();
  const config = useSiteConfig();

  const phone = config.contactPhone || "+91 9613461462";
  const email = config.contactEmail || "info@acctaxsolutions.in";
  const address = config.address || "Fancy Ali, Jorhat, Assam - 785001";

  const offices = [
    {
      city: "Jorhat (HQ)",
      address,
      phone,
      email,
      gradient: "from-blue-600 to-indigo-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-14 sm:py-20 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-white/80 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t.contact.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Let&apos;s Talk About Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400">
                Tax Needs
              </span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
              Whether you have a question about GST, income tax, or any other compliance matter, our team is ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      <ContactSection />

      {/* Offices */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Our Locations"
            title="Visit Us Across India"
            subtitle="We have offices in major cities to serve you better."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 max-w-md mx-auto gap-4 sm:gap-6 mt-8">
            {offices.map((office, i) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-xl">
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${office.gradient} opacity-80`} />
                  <div className={`absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-gradient-to-b ${office.gradient} transition-all duration-500 rounded-full`} />

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${office.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r ${office.gradient}`}>
                        {office.city}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">{office.address}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 ml-0.5">
                    <a href={`tel:${office.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-blue-600 transition-colors group/phone">
                      <span className={`w-8 h-8 rounded-lg ${office.iconBg} flex items-center justify-center`}>
                        <Phone className={`w-4 h-4 ${office.iconColor}`} />
                      </span>
                      {office.phone}
                    </a>
                    <a href={`mailto:${office.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 transition-colors group/email">
                      <span className={`w-8 h-8 rounded-lg ${office.iconBg} flex items-center justify-center`}>
                        <Mail className={`w-4 h-4 ${office.iconColor}`} />
                      </span>
                      {office.email}
                    </a>
                  </div>

                  <a
                    href="https://maps.google.com/?q=26.759569,94.217385"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-5 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors group/map"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Get Directions
                    <ChevronRight className="w-3 h-3 group-hover/map:translate-x-0.5 transition-transform" />
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
