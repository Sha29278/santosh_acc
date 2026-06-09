import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero";
import ServicesSection from "@/components/sections/services-section";
import PricingSection from "@/components/sections/pricing-section";
import BlogSection from "@/components/sections/blog-section";
import FAQSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";
import ComplianceCalendar from "@/components/sections/compliance-calendar";
import SectionDivider from "@/components/ui/section-divider";

export const metadata: Metadata = {
  title: "AccTax Solutions — GST Filing, Income Tax & Compliance Services",
  description: "India's trusted GST filing and income tax return service. 13+ years expertise, 100+ clients. GST registration, TDS filing, business compliance. Free consultation. Call +91 9613461462.",
  keywords: ["GST filing", "income tax filing", "GST registration", "tax consultant India", "best tax services", "tax filing online", "GST return"],
  openGraph: {
    title: "AccTax Solutions — GST Filing, Income Tax & Compliance Services | Jorhat, Assam",
    description: "Professional tax filing and compliance services. 13+ years of expertise. Trusted by 100+ businesses across India.",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SectionDivider variant="wave" fromColor="#6366F1" toColor="#EC4899" />
      <ServicesSection />
      <SectionDivider variant="curve" fromColor="#EC4899" toColor="#06B6D4" />
      <ComplianceCalendar />
      <SectionDivider variant="angle" fromColor="#F59E0B" toColor="#EC4899" />
      <PricingSection />
      <SectionDivider variant="wave" fromColor="#EC4899" toColor="#6366F1" />
      <BlogSection />
      <SectionDivider variant="wave" fromColor="#06B6D4" toColor="#EC4899" />
      <FAQSection />
      <SectionDivider variant="angle" fromColor="#EC4899" toColor="#F59E0B" />
      <ContactSection />
    </>
  );
}
