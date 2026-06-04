import HeroSection from "@/components/sections/hero";
import ServicesSection from "@/components/sections/services-section";
import PricingSection from "@/components/sections/pricing-section";
import BlogSection from "@/components/sections/blog-section";
import FAQSection from "@/components/sections/faq-section";
import ContactSection from "@/components/sections/contact-section";
import ComplianceCalendar from "@/components/sections/compliance-calendar";
import SectionDivider from "@/components/ui/section-divider";

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
