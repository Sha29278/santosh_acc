import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
  const dataDir = path.join(process.cwd(), "data");

  const readFile = (filename: string, fallback: Record<string, unknown>[]) => {
    const fp = path.join(dataDir, filename);
    if (!fs.existsSync(fp)) return fallback;
    return JSON.parse(fs.readFileSync(fp, "utf-8"));
  };

  const siteData: SiteData = {
    services: readFile("services.json", []),
    testimonials: readFile("testimonials.json", []),
    faqs: readFile("faqs.json", []),
    blogPosts: readFile("blog-posts.json", []),
    whyChooseUs: [
      { title: "10+ Years Experience", description: "Over a decade of excellence in taxation and compliance services across India.", icon: "Award", stat: "10+", suffix: "Years" },
      { title: "5000+ Clients", description: "Trusted by thousands of businesses, startups, and individuals nationwide.", icon: "Users", stat: "5000+", suffix: "Clients" },
      { title: "99% Filing Accuracy", description: "Industry-leading accuracy rate with zero-error compliance guarantees.", icon: "CheckCircle", stat: "99%", suffix: "Accuracy" },
      { title: "Secure Data Protection", description: "Bank-grade encryption and data protection for all your confidential documents.", icon: "Shield", stat: "100%", suffix: "Secure" },
    ],
    pricingPlans: [
      { name: "Starter", price: 999, period: "month", description: "Perfect for freelancers and small businesses.", features: ["GST Registration Assistance", "Monthly GST Return Filing", "Basic Tax Consultation", "Email Support", "Document Upload Portal"], recommended: false, color: "from-slate-500 to-slate-400" },
      { name: "Professional", price: 2999, period: "month", description: "Ideal for growing businesses needing comprehensive tax compliance.", features: ["Everything in Starter", "GSTR-1 & GSTR-3B Filing", "Income Tax Return Filing", "TDS Return Filing", "Accounting Support", "Priority Email & Phone Support", "Quarterly Business Review"], recommended: true, color: "from-blue-600 to-emerald-500" },
      { name: "Enterprise", price: 9999, period: "month", description: "Complete compliance suite for established enterprises.", features: ["Everything in Professional", "Dedicated Account Manager", "ROC Compliance Management", "Payroll Processing", "Audit Support", "GST Annual Return Filing", "24/7 Priority Support", "Monthly Performance Reports"], recommended: false, color: "from-amber-600 to-amber-500" },
    ],
    processSteps: [
      { step: 1, title: "Register", description: "Sign up and share your basic business details." },
      { step: 2, title: "Upload Documents", description: "Upload required documents securely through our portal." },
      { step: 3, title: "Verification", description: "Our experts verify documents and process your application." },
      { step: 4, title: "Filing", description: "We prepare and file your returns with accuracy." },
      { step: 5, title: "Confirmation", description: "Receive confirmation and track your filing status anytime." },
    ],
  };

  return NextResponse.json(siteData);
}
