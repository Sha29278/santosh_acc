"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/section-title";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { useSiteConfig } from "@/lib/use-site-config";

export default function ContactSection() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const config = useSiteConfig();

  const phone = config.contactPhone || "+91 9613461462";
  const email = config.contactEmail || "info@acctaxsolutions.in";
  const address = config.address || "Fancy Ali, Jorhat (Assam) — 785001";
  const phoneHref = phone.replace(/\s+/g, "");
  const whatsappNumber = phone.replace(/[^0-9]/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={t.contact.badge}
          title={t.contact.title}
          subtitle={t.contact.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500" />
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{t.contact.form.thankYou}</h3>
                  <p className="text-slate-600">{t.contact.form.thankYouMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.contact.form.fullName}</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Put your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.contact.form.email}</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.contact.form.phone}</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                      placeholder="Your phone no"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.contact.form.serviceNeeded}</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white">
                      <option value="">{t.contact.form.selectService}</option>
                      <option>GST Registration</option>
                      <option>GST Return Filing</option>
                      <option>Income Tax Filing</option>
                      <option>TDS Return Filing</option>
                      <option>Company Registration</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{t.contact.form.message}</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>
                  <Button type="submit" variant="rainbow" className="w-full">
                    <Send className="w-4 h-4" />
                    {t.contact.form.sendMessage}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t.contact.callUs}</h3>
                  <a href={`tel:${phoneHref}`} className="text-blue-600 hover:underline font-medium">
                    {phone}
                  </a>
                  <p className="text-sm text-slate-500 mt-1">{t.contact.workingHours}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-sky-50 border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t.contact.emailUs}</h3>
                  <a href={`mailto:${email}`} className="text-indigo-600 hover:underline font-medium">
                    {email}
                  </a>
                  <p className="text-sm text-slate-500 mt-1">{t.contact.replyTime}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{t.contact.visitUs}</h3>
                  <p className="text-slate-600">{address}</p>
                  <p className="text-sm text-slate-500 mt-1">{t.contact.byAppointment}</p>
                </div>
              </div>
            </Card>

            {/* Mini Map */}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-md h-48 group">
              <iframe
                src="https://www.google.com/maps?q=26.759569,94.217385&output=embed&z=15"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.15)" }}
                allowFullScreen
                loading="lazy"
                title="AccTax Solutions Location"
                className="w-full h-full transition-all duration-700 hover:filter-none"
                onMouseEnter={(e) => e.currentTarget.style.filter = 'none'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'grayscale(0.15)'}
              />
            </div>

            {/* WhatsApp CTA */}
            <Card className="p-6 bg-gradient-to-br from-emerald-500 via-emerald-600 to-cyan-600 text-white border-0 shadow-xl">
              <div className="flex items-center gap-4">
                <MessageCircle className="w-10 h-10" />
                <div>
                  <h3 className="font-semibold mb-1">{t.contact.quickChat}</h3>
                  <p className="text-sm text-white/80">{t.contact.quickChatDesc}</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 rounded-xl font-medium text-sm hover:bg-emerald-50 transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                {t.contact.chatOnWhatsApp}
              </a>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
