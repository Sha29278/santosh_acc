import { NextResponse } from "next/server";
import { readJSON } from "@/lib/admin/storage";

interface SiteData {
  services: Record<string, unknown>[];
  testimonials: Record<string, unknown>[];
  faqs: Record<string, unknown>[];
  blogPosts: Record<string, unknown>[];
  whyChooseUs: Record<string, unknown>[];
  pricingPlans: Record<string, unknown>[];
  processSteps: Record<string, unknown>[];
}

export const dynamic = "force-dynamic";

export async function GET() {
  // Read saved site-content to get the user-selected Most Popular plan
  const savedContent = await readJSON<Record<string, Record<string, unknown>>>("site-content.json", {});
  const pricingContent = (savedContent.pricing || {}) as Record<string, unknown>;
  const mostPopularPlan = (pricingContent.mostPopularPlan as string) || "Professional";

  const siteData: SiteData = {
    services: await readJSON("services.json", []),
    testimonials: await readJSON("testimonials.json", []),
    faqs: await readJSON("faqs.json", []),
    blogPosts: await readJSON("blog-posts.json", []),
    whyChooseUs: [
      { title: "13+ Years Experience", description: "Over 13 years of excellence in taxation, accounting, and compliance services across India.", icon: "Award", stat: "13+", suffix: "Years" },
      { title: "100+ Trusted Customers", description: "Trusted by over 100 businesses and individuals for reliable taxation and compliance services.", icon: "Users", stat: "100+", suffix: "Trusted Customers" },
      { title: "99% Filing Accuracy", description: "Industry-leading accuracy rate with zero-error compliance guarantees.", icon: "CheckCircle", stat: "99%", suffix: "Accuracy" },
      { title: "Secure Data Protection", description: "Bank-grade encryption and data protection for all your confidential documents.", icon: "Shield", stat: "100%", suffix: "Secure" },
    ],
    pricingPlans: [
      {
        name: "Starter", price: 999, period: "month",
        description: "Perfect for freelancers, students & businesses with turnover under ₹3 Lakh.",
        features: ["GST Registration Assistance", "Monthly GST Return Filing (GSTR-3B)", "Basic Tax Consultation", "Email Support", "Document Upload Portal"],
        recommended: "Starter" === mostPopularPlan,
        color: "from-blue-500 to-indigo-500", incomeTag: "Turnover under ₹3 Lakh", incomeMax: 300000,
      },
      {
        name: "Basic", price: 2499, period: "month",
        description: "Ideal for small businesses & professionals with turnover ₹3-10 Lakh.",
        features: ["Everything in Starter", "GSTR-1 & GSTR-3B Filing", "Income Tax Return Filing", "TDS Return Filing", "Accounting Support", "Priority Email & Phone Support", "Quarterly Business Review"],
        recommended: "Basic" === mostPopularPlan,
        color: "from-blue-600 to-indigo-500", incomeTag: "Turnover ₹3-10 Lakh", incomeMin: 300000, incomeMax: 1000000,
      },
      {
        name: "Professional", price: 4999, period: "month",
        description: "Perfect for established businesses & professionals with turnover ₹10-20 Lakh.",
        features: ["Everything in Basic", "Dedicated Account Manager", "ROC Compliance Management", "Payroll Processing", "GST Annual Return Filing", "24/7 Priority Support", "Monthly Performance Reports"],
        recommended: "Professional" === mostPopularPlan,
        color: "from-indigo-600 to-blue-600", incomeTag: "Turnover ₹10-20 Lakh", incomeMin: 1000000, incomeMax: 1999999,
      },
      {
        name: "Enterprise", price: 6999, period: "month",
        description: "Complete compliance suite for enterprises with turnover above ₹20 Lakh.",
        features: ["Everything in Professional", "Audit Support", "GST Annual Return Filing", "Income Tax Planning & Advisory", "Dedicated CA Support", "Custom Compliance Solutions"],
        recommended: "Enterprise" === mostPopularPlan,
        color: "from-purple-600 to-indigo-600", incomeTag: "Turnover ₹20 Lakh+", incomeMin: 2000000,
      },
    ],
    processSteps: [
      { step: 1, title: "Register", description: "Sign up and share your basic business details with our team." },
      { step: 2, title: "Upload Documents", description: "Upload required documents securely through our portal." },
      { step: 3, title: "Verification", description: "Our experts verify documents and process your application." },
      { step: 4, title: "Filing", description: "We prepare and file your returns with accuracy and care." },
      { step: 5, title: "Confirmation", description: "Receive confirmation and track your filing status anytime." },
    ],
  };

  return NextResponse.json(siteData);
}
