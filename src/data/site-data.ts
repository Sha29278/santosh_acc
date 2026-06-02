export const services = [
  {
    id: "gst-registration",
    title: "GST Registration",
    description: "Hassle-free GST registration for your business with expert guidance. Get your GSTIN within 5-7 working days.",
    icon: "FileCheck",
    gradient: "from-blue-600 to-blue-500",
  },
  {
    id: "gst-return",
    title: "GST Return Filing",
    description: "Timely and accurate filing of GSTR-1, GSTR-3B, and annual returns with complete reconciliation.",
    icon: "FileText",
    gradient: "from-blue-600 to-blue-500",
  },
  {
    id: "income-tax",
    title: "Income Tax Filing",
    description: "Comprehensive income tax return filing services for individuals, businesses, and professionals.",
    icon: "Landmark",
    gradient: "from-indigo-600 to-indigo-500",
  },
  {
    id: "tds",
    title: "TDS Return Filing",
    description: "Error-free TDS return preparation and filing for all form types with deadline tracking.",
    icon: "Receipt",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "roc-compliance",
    title: "ROC Compliance",
    description: "Complete ROC compliance services including annual filings, board meetings, and statutory registers.",
    icon: "Building2",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    id: "company-registration",
    title: "Company Registration",
    description: "End-to-end company incorporation services — Private Limited, LLP, OPC, and Partnership firms.",
    icon: "Briefcase",
    gradient: "from-sky-600 to-sky-500",
  },
  {
    id: "msme-registration",
    title: "MSME Registration",
    description: "Quick MSME/Udyam registration to unlock government subsidies, cheaper loans, and priority sector benefits.",
    icon: "Building",
    gradient: "from-sky-500 to-blue-600",
  },
  {
    id: "accounting",
    title: "Accounting & Bookkeeping",
    description: "Professional accounting services including books of accounts, bank reconciliation, and financial statements.",
    icon: "Calculator",
    gradient: "from-indigo-600 to-indigo-500",
  },
  {
    id: "payroll",
    title: "Payroll Management",
    description: "Complete payroll processing including salary computation, PF/ESI compliance, and payslip generation.",
    icon: "Users",
    gradient: "from-blue-500 to-sky-500",
  },
  {
    id: "audit",
    title: "Audit & Assurance",
    description: "Statutory audit, tax audit, internal audit, and stock audit services by experienced professionals.",
    icon: "SearchCheck",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    id: "tax-consultation",
    title: "Tax Consultation",
    description: "Expert tax consultation for businesses and individuals on direct & indirect tax matters.",
    icon: "Lightbulb",
    gradient: "from-sky-600 to-sky-500",
  },
];

export const whyChooseUs = [
  {
    title: "10+ Years Experience",
    description: "Over a decade of excellence in taxation and compliance services across India.",
    icon: "Award",
    stat: "10+",
    suffix: "Years",
  },
  {
    title: "5000+ Clients",
    description: "Trusted by thousands of businesses, startups, and individuals nationwide.",
    icon: "Users",
    stat: "5000+",
    suffix: "Clients",
  },
  {
    title: "99% Filing Accuracy",
    description: "Industry-leading accuracy rate with zero-error compliance guarantees.",
    icon: "CheckCircle",
    stat: "99%",
    suffix: "Accuracy",
  },
  {
    title: "Secure Data Protection",
    description: "Bank-grade encryption and data protection for all your confidential documents.",
    icon: "Shield",
    stat: "100%",
    suffix: "Secure",
  },
];export interface PricingPlan {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  recommended: boolean;
  color: string;
  incomeTag: string;
  incomeMin?: number;
  incomeMax?: number;
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: 999,
    period: "month",
    description: "Perfect for freelancers, students & individuals starting their tax journey.",
    features: [
      "GST Registration Assistance",
      "Monthly GST Return Filing (GSTR-3B)",
      "Basic Tax Consultation",
      "Email Support",
      "Document Upload Portal",
    ],
    recommended: false,
    color: "from-blue-500 to-indigo-500",
    incomeTag: "Income under ₹3 Lakh",
    incomeMax: 300000,
  },
  {
    name: "Professional",
    price: 2999,
    period: "month",
    description: "Ideal for growing businesses & professionals with higher compliance needs.",
    features: [
      "Everything in Starter",
      "GSTR-1 & GSTR-3B Filing",
      "Income Tax Return Filing",
      "TDS Return Filing",
      "Accounting Support",
      "Priority Email & Phone Support",
      "Quarterly Business Review",
    ],
    recommended: true,
    color: "from-blue-600 to-indigo-500",
    incomeTag: "Income above ₹5 Lakh",
    incomeMin: 500000,
  },
  {
    name: "Enterprise",
    price: 9999,
    period: "month",
    description: "Complete compliance suite for established enterprises & high-net-worth individuals.",
    features: [
      "Everything in Professional",
      "Dedicated Account Manager",
      "ROC Compliance Management",
      "Payroll Processing",
      "Audit Support",
      "GST Annual Return Filing",
      "24/7 Priority Support",
      "Monthly Performance Reports",
    ],
    recommended: false,
    color: "from-indigo-600 to-blue-600",
    incomeTag: "Income above ₹10 Lakh",
    incomeMin: 1000000,
  },
];


export const faqs = [
  {
    question: "What is GST and who needs to register?",
    answer: "GST (Goods and Services Tax) is a comprehensive indirect tax on supply of goods and services. Businesses with turnover exceeding ₹40 lakhs (₹20 lakhs for special category states) must register. E-commerce operators, inter-state suppliers, and certain other categories require mandatory registration regardless of turnover.",
  },
  {
    question: "How long does GST registration take?",
    answer: "GST registration typically takes 5-7 working days once all documents are submitted correctly. Our expert team ensures error-free application to avoid delays. We handle the entire process end-to-end.",
  },
  {
    question: "What documents are needed for GST registration?",
    answer: "You'll need PAN card, Aadhaar card, proof of business registration (if applicable), bank account details, cancelled cheque, address proof of business premises, and digital signature. Our team will guide you through the complete list based on your business type.",
  },
  {
    question: "What is the difference between GSTR-1 and GSTR-3B?",
    answer: "GSTR-1 is a monthly/quarterly return showing outward supplies (sales) while GSTR-3B is a summary return with details of sales, purchases, and tax liability. GSTR-1 is due on 11th and GSTR-3B on 20th of every month. We handle both for you.",
  },
  {
    question: "Can I file GST returns myself?",
    answer: "Yes, you can file GST returns yourself through the GST portal. However, the process involves complex calculations, reconciliation, and compliance requirements. Professional assistance ensures accuracy, avoids penalties, and saves valuable time.",
  },
  {
    question: "What are the penalties for late GST filing?",
    answer: "Late filing attracts a late fee of ₹50 per day (₹25 CGST + ₹25 SGST) for regular returns. For nil returns, the late fee is ₹20 per day (₹10 + ₹10). Interest at 18% per annum is also applicable on the tax amount. Our timely reminder system helps you avoid these penalties.",
  },
  {
    question: "How is GST calculated?",
    answer: "GST is calculated as a percentage of the taxable value. Common rates include 5%, 12%, 18%, and 28%. CGST and SGST are each half of the total rate for intra-state supplies, while IGST applies to inter-state supplies. Our GST calculator helps you compute the exact amount instantly.",
  },
  {
    question: "Do I need to pay GST if my turnover is below the threshold?",
    answer: "If your turnover is below the threshold and you haven't voluntarily registered, you don't need to collect or pay GST. However, you also can't claim input tax credit. Some businesses choose to voluntarily register to avail ITC benefits and appear more credible.",
  },
];

export const blogPosts = [
  {
    id: 1,
    title: "Complete Guide to GST Registration in India 2025",
    excerpt: "Everything you need to know about GST registration — eligibility, documents required, step-by-step process, and common mistakes to avoid.",
    category: "GST",
    author: "TaxEase Team",
    date: "March 15, 2025",
    readTime: "8 min read",
    image: "/gst-guide.svg",
    slug: "gst-registration-guide-2025",
  },
  {
    id: 2,
    title: "Income Tax Saving Tips for Salaried Employees FY 2025-26",
    excerpt: "Smart tax planning strategies for salaried employees — 80C investments, home loan benefits, NPS, health insurance, and more.",
    category: "Income Tax",
    author: "TaxEase Team",
    date: "March 10, 2025",
    readTime: "6 min read",
    image: "/tax-saving.svg",
    slug: "tax-saving-tips-salaried-2025",
  },
  {
    id: 3,
    title: "MSME Registration: Benefits and Simplified Process",
    excerpt: "Learn how MSME/Udyam registration can unlock subsidies, cheaper loans, and priority sector benefits for your business.",
    category: "Registration",
    author: "TaxEase Team",
    date: "March 5, 2025",
    readTime: "5 min read",
    image: "/msme.svg",
    slug: "msme-registration-benefits-process",
  },
  {
    id: 4,
    title: "New vs Old Tax Regime: Which is Better for You?",
    excerpt: "Detailed comparison of new and old tax regimes with calculations to help you make an informed decision for FY 2025-26.",
    category: "Income Tax",
    author: "TaxEase Team",
    date: "February 28, 2025",
    readTime: "7 min read",
    image: "/tax-regime.svg",
    slug: "new-vs-old-tax-regime-comparison",
  },
  {
    id: 5,
    title: "Understanding TDS: A Complete Guide for Businesses",
    excerpt: "Everything about TDS — applicable sections, rates, due dates, return filing, and common compliance pitfalls to avoid.",
    category: "TDS",
    author: "TaxEase Team",
    date: "February 20, 2025",
    readTime: "9 min read",
    image: "/tds-guide.svg",
    slug: "understanding-tds-complete-guide",
  },
  {
    id: 6,
    title: "ROC Compliance Calendar 2025: Key Deadlines",
    excerpt: "Stay compliant with our comprehensive ROC compliance calendar covering all important filing deadlines for FY 2025-26.",
    category: "ROC",
    author: "TaxEase Team",
    date: "February 15, 2025",
    readTime: "6 min read",
    image: "/roc-calendar.svg",
    slug: "roc-compliance-calendar-2025",
  },
];

export const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner, Delhi",
    content: "TaxEase made GST filing incredibly simple. Their team handled everything from registration to returns. Highly recommended for any business owner!",
    rating: 5,
    initials: "RK",
  },
  {
    name: "Priya Sharma",
    role: "Freelancer, Mumbai",
    content: "As a freelancer, I was always stressed about tax compliance. TaxEase simplified everything and saved me thousands in potential penalties.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Amit Patel",
    role: "Startup Founder, Bangalore",
    content: "The team provided exceptional DPIIT recognition support. They guided us through every step and got it done in record time.",
    rating: 5,
    initials: "AP",
  },
  {
    name: "Neha Gupta",
    role: "CA, Pune",
    content: "I refer my clients to TaxEase for their GST needs. Their professionalism, accuracy, and turnaround time are outstanding.",
    rating: 5,
    initials: "NG",
  },
  {
    name: "Vikram Singh",
    role: "SME Owner, Jaipur",
    content: "Switched to TaxEase from another service and the difference is night and day. Proactive support, accurate filings, and great value.",
    rating: 5,
    initials: "VS",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Register",
    description: "Sign up and share your basic business details with our team.",
  },
  {
    step: 2,
    title: "Upload Documents",
    description: "Upload required documents securely through our portal.",
  },
  {
    step: 3,
    title: "Verification",
    description: "Our experts verify documents and process your application.",
  },
  {
    step: 4,
    title: "Filing",
    description: "We prepare and file your returns with accuracy and care.",
  },
  {
    step: 5,
    title: "Confirmation",
    description: "Receive confirmation and track your filing status anytime.",
  },
];
