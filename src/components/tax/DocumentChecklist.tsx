"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  FileText,
  CheckCircle2,
  Circle,
  Download,
  Briefcase,
  Building2,
  Stethoscope,
  Laptop,
  Landmark,
  Home,
  GraduationCap,
  Heart,
  Shield,
  Car,
  ArrowRight,
  Printer,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

type EmploymentType = "salaried" | "business" | "professional" | "freelancer" | "retired" | "student";
type IncomeSource = "salary" | "rental" | "capital-gains" | "interest" | "business" | "foreign" | "other";
type DeductionType = "80c" | "80d" | "nps" | "hra" | "home-loan" | "donation" | "education-loan";

interface ChecklistItem {
  id: string;
  label: string;
  details: string;
  required: boolean;
  category: "identity" | "income" | "investment" | "property" | "bank" | "other";
  icon: React.ReactNode;
}

// ─── Document Rules Engine ───────────────────────────────────────────────

function generateChecklist(
  employmentType: EmploymentType | null,
  incomeSources: IncomeSource[],
  deductions: DeductionType[],
  regime: "old" | "new"
): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Always required
  items.push(
    {
      id: "pan-card",
      label: "PAN Card",
      details: "Permanent Account Number card (or scanned copy)",
      required: true,
      category: "identity",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "aadhaar",
      label: "Aadhaar Card",
      details: "Aadhaar card or enrollment ID (for e-verification)",
      required: true,
      category: "identity",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "bank-statement",
      label: "Bank Account Statement",
      details: "Last 6 months bank statement (all accounts held)",
      required: true,
      category: "bank",
      icon: <Landmark className="w-4 h-4" />,
    },
    {
      id: "form-26as",
      label: "Form 26AS",
      details: "Annual tax statement from Income Tax Portal (login & download)",
      required: true,
      category: "income",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "ais",
      label: "Annual Information Statement (AIS)",
      details: "Comprehensive income statement from Income Tax Portal",
      required: true,
      category: "income",
      icon: <FileText className="w-4 h-4" />,
    }
  );

  // Employment-specific
  if (employmentType === "salaried") {
    items.push({
      id: "form-16",
      label: "Form 16 (from all employers)",
      details: "TDS certificate issued by each employer for the relevant FY",
      required: true,
      category: "income",
      icon: <Briefcase className="w-4 h-4" />,
    });
    items.push({
      id: "salary-slips",
      label: "Salary Slips (last 3-12 months)",
      details: "Monthly payslips showing salary breakup, deductions, and TDS",
      required: true,
      category: "income",
      icon: <Briefcase className="w-4 h-4" />,
    });
  }

  if (employmentType === "business") {
    items.push(
      {
        id: "balance-sheet",
        label: "Balance Sheet & P&L Statement",
        details: "Audited or unaudited financial statements for the FY",
        required: true,
        category: "income",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        id: "audit-report",
        label: "Tax Audit Report (Form 3CA-3CD / 3CB-3CD)",
        details: "Audit report u/s 44AB if turnover exceeds threshold",
        required: true,
        category: "income",
        icon: <Building2 className="w-4 h-4" />,
      },
      {
        id: "gst-returns",
        label: "GST Returns Filed",
        details: "Summary of GSTR-1, GSTR-3B filed during the FY",
        required: false,
        category: "income",
        icon: <FileText className="w-4 h-4" />,
      }
    );
  }

  if (employmentType === "professional" || employmentType === "freelancer") {
    items.push({
      id: "income-expense",
      label: "Income & Expense Statement",
      details: "Detailed breakdown of professional receipts and expenses",
      required: true,
      category: "income",
      icon: <Laptop className="w-4 h-4" />,
    });
    if (employmentType === "professional") {
      items.push({
        id: "certificate",
        label: "Professional Qualification Certificate",
        details: "Degree, registration certificate (if applicable)",
        required: false,
        category: "identity",
        icon: <Stethoscope className="w-4 h-4" />,
      });
    }
    // Presumptive taxation
    items.push({
      id: "44ada-info",
      label: "Presumptive Taxation (44ADA) Declaration",
      details: "If opting for presumptive taxation scheme (50% or 8% of gross receipts)",
      required: false,
      category: "income",
      icon: <FileText className="w-4 h-4" />,
    });
  }

  if (employmentType === "retired") {
    items.push({
      id: "pension-docs",
      label: "Pension Statement / Certificate",
      details: "Pension payment order & TDS certificate from pension paying authority",
      required: true,
      category: "income",
      icon: <Landmark className="w-4 h-4" />,
    });
  }

  // Income source-specific
  if (incomeSources.includes("rental")) {
    items.push({
      id: "rent-agreement",
      label: "Rental Agreement / Lease Deed",
      details: "Copy of registered rental agreement for property income",
      required: true,
      category: "property",
      icon: <Home className="w-4 h-4" />,
    });
    items.push({
      id: "property-tax",
      label: "Property Tax Receipts",
      details: "Municipal tax paid receipts (deductible from rental income)",
      required: false,
      category: "property",
      icon: <Home className="w-4 h-4" />,
    });
  }

  if (incomeSources.includes("capital-gains")) {
    items.push(
      {
        id: "broker-statement",
        label: "Stock/Mutual Fund Transaction Statement",
        details: "Annual statement from broker / DP showing all buy/sell transactions",
        required: true,
        category: "income",
        icon: <TrendingIcon />,
      },
      {
        id: "capital-gains-calc",
        label: "Capital Gains Calculation Sheet",
        details: "Computed gains/losses for each transaction (short-term & long-term)",
        required: true,
        category: "income",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        id: "demat-statement",
        label: "Demat Account Holding Statement",
        details: "Statement showing securities held as on 31st Jan (for grandfathering)",
        required: false,
        category: "income",
        icon: <Shield className="w-4 h-4" />,
      }
    );
  }

  if (incomeSources.includes("interest")) {
    items.push({
      id: "interest-cert",
      label: "Interest Certificates (FD/RD/Savings)",
      details: "Certificates from banks/post office showing interest credited",
      required: true,
      category: "income",
      icon: <Landmark className="w-4 h-4" />,
    });
    items.push({
      id: "form-16a",
      label: "Form 16A (TDS on Interest)",
      details: "TDS certificate for interest income above threshold",
      required: false,
      category: "income",
      icon: <FileText className="w-4 h-4" />,
    });
  }

  if (incomeSources.includes("foreign")) {
    items.push({
      id: "foreign-income",
      label: "Foreign Income Documentation",
      details: "Bank statements, tax returns, and proof of taxes paid abroad (FATCA/CRS)",
      required: true,
      category: "income",
      icon: <FileText className="w-4 h-4" />,
    });
    items.push({
      id: "dtaa-claim",
      label: "DTAA Claim Documents",
      details: "Form 10F & Tax Residency Certificate for double taxation relief claim",
      required: false,
      category: "income",
      icon: <FileText className="w-4 h-4" />,
    });
  }

  // Deduction-specific (old regime only)
  if (regime === "old") {
    if (deductions.includes("80c")) {
      items.push({
        id: "80c-proofs",
        label: "Section 80C Investment Proofs",
        details: "PPF passbook, ELSS statement, LIC premium receipts, EPF statement, ULIP, SSY, etc.",
        required: true,
        category: "investment",
        icon: <Shield className="w-4 h-4" />,
      });
      items.push({
        id: "80c-tuition",
        label: "Children Tuition Fee Receipts",
        details: "Fee receipts for children's education (eligible u/s 80C)",
        required: false,
        category: "investment",
        icon: <GraduationCap className="w-4 h-4" />,
      });
    }

    if (deductions.includes("80d")) {
      items.push({
        id: "80d-proofs",
        label: "Section 80D Health Insurance Premium",
        details: "Receipts for medical insurance premiums paid (self, family, parents)",
        required: true,
        category: "investment",
        icon: <Heart className="w-4 h-4" />,
      });
      items.push({
        id: "80d-checkup",
        label: "Preventive Health Checkup Receipts",
        details: "Receipts for health checkup (up to ₹5K deduction within 80D limit)",
        required: false,
        category: "investment",
        icon: <Heart className="w-4 h-4" />,
      });
    }

    if (deductions.includes("nps")) {
      items.push({
        id: "nps-statement",
        label: "NPS Contribution Statement",
        details: "NPS Tier-I account statement showing contributions u/s 80CCD(1B)",
        required: true,
        category: "investment",
        icon: <GraduationCap className="w-4 h-4" />,
      });
    }

    if (deductions.includes("hra")) {
      items.push({
        id: "rent-receipts",
        label: "Rent Receipts & Rent Agreement",
        details: "Monthly rent receipts and registered rent agreement (for HRA claim)",
        required: true,
        category: "property",
        icon: <Home className="w-4 h-4" />,
      });
      items.push({
        id: "landlord-pan",
        label: "Landlord's PAN (if rent > ₹1L/year)",
        details: "Copy of landlord's PAN card for rent exceeding ₹1L annually",
        required: true,
        category: "property",
        icon: <FileText className="w-4 h-4" />,
      });
    }

    if (deductions.includes("home-loan")) {
      items.push({
        id: "home-loan-cert",
        label: "Home Loan Interest Certificate",
        details: "Certificate from bank showing principal & interest paid (u/s 24 & 80C)",
        required: true,
        category: "property",
        icon: <Home className="w-4 h-4" />,
      });
    }

    if (deductions.includes("donation")) {
      items.push({
        id: "donation-receipts",
        label: "Donation Receipts (80G)",
        details: "Receipts from approved charitable institutions with 80G registration number",
        required: true,
        category: "investment",
        icon: <Heart className="w-4 h-4" />,
      });
    }

    if (deductions.includes("education-loan")) {
      items.push({
        id: "edu-loan-cert",
        label: "Education Loan Interest Certificate",
        details: "Certificate from bank showing interest paid on education loan (80E)",
        required: true,
        category: "investment",
        icon: <GraduationCap className="w-4 h-4" />,
      });
    }
  }

  return items;
}

// ─── Sub-components ──────────────────────────────────────────────────────

function TrendingIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

const employmentOptions: { value: EmploymentType; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "salaried", label: "Salaried Employee", icon: <Briefcase className="w-4 h-4" />, description: "Working for a company/employer" },
  { value: "business", label: "Business Owner", icon: <Building2 className="w-4 h-4" />, description: "Owns a business or trading concern" },
  { value: "professional", label: "Professional", icon: <Stethoscope className="w-4 h-4" />, description: "Doctor, lawyer, CA, architect, etc." },
  { value: "freelancer", label: "Freelancer", icon: <Laptop className="w-4 h-4" />, description: "Independent contractor / gig worker" },
  { value: "retired", label: "Retired / Pensioner", icon: <Landmark className="w-4 h-4" />, description: "Receiving pension income" },
  { value: "student", label: "Student", icon: <GraduationCap className="w-4 h-4" />, description: "No income / dependent" },
];

const incomeSourceOptions: { value: IncomeSource; label: string; icon: React.ReactNode }[] = [
  { value: "salary", label: "Salary / Pension", icon: <Briefcase className="w-4 h-4" /> },
  { value: "rental", label: "Rental Income", icon: <Home className="w-4 h-4" /> },
  { value: "capital-gains", label: "Capital Gains (Stocks/Property)", icon: <TrendingIcon /> },
  { value: "interest", label: "Interest Income (FD/Savings)", icon: <Landmark className="w-4 h-4" /> },
  { value: "business", label: "Business / Professional Income", icon: <Building2 className="w-4 h-4" /> },
  { value: "foreign", label: "Foreign Assets / Foreign Income", icon: <FileText className="w-4 h-4" /> },
  { value: "other", label: "Other Income", icon: <FileText className="w-4 h-4" /> },
];

const deductionOptions: { value: DeductionType; label: string; icon: React.ReactNode }[] = [
  { value: "80c", label: "80C (PPF, ELSS, LIC)", icon: <Shield className="w-4 h-4" /> },
  { value: "80d", label: "80D (Health Insurance)", icon: <Heart className="w-4 h-4" /> },
  { value: "nps", label: "NPS (80CCD(1B))", icon: <GraduationCap className="w-4 h-4" /> },
  { value: "hra", label: "HRA Exemption", icon: <Home className="w-4 h-4" /> },
  { value: "home-loan", label: "Home Loan Interest", icon: <Home className="w-4 h-4" /> },
  { value: "donation", label: "Donations (80G)", icon: <Heart className="w-4 h-4" /> },
  { value: "education-loan", label: "Education Loan (80E)", icon: <GraduationCap className="w-4 h-4" /> },
];

// ─── Main Component ──────────────────────────────────────────────────────

interface DocumentChecklistProps {
  regime: "old" | "new";
}

export default function DocumentChecklist({ regime }: DocumentChecklistProps) {
  const [step, setStep] = useState(0);
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(null);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [deductions, setDeductions] = useState<DeductionType[]>([]);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const checklist = useMemo(
    () => generateChecklist(employmentType, incomeSources, deductions, regime),
    [employmentType, incomeSources, deductions, regime]
  );

  const toggleIncomeSource = (source: IncomeSource) => {
    setIncomeSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  const toggleDeduction = (deduction: DeductionType) => {
    setDeductions((prev) =>
      prev.includes(deduction) ? prev.filter((d) => d !== deduction) : [...prev, deduction]
    );
  };

  const toggleChecked = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const completedCount = checkedItems.size;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const reset = () => {
    setStep(0);
    setEmploymentType(null);
    setIncomeSources([]);
    setDeductions([]);
    setCheckedItems(new Set());
  };

  const requiredChecklist = checklist.filter((i) => i.required);
  const optionalChecklist = checklist.filter((i) => !i.required);

  const steps = ["Employment", "Income", "Deductions", "Checklist"];

  const canProceed = () => {
    if (step === 0) return employmentType !== null;
    if (step === 1) return incomeSources.length > 0;
    if (step === 2) return true; // Allow proceeding even with 0 deductions // skip if new regime
    return true;
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-100 overflow-hidden">
      {/* Step indicator */}
      <div className="bg-white border-b border-blue-100 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Document Checklist Generator
          </h3>
          {step === 3 && (
            <button
              onClick={reset}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Start Over
            </button>
          )}
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-3">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  step === idx
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : step > idx
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > idx ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span>{idx + 1}</span>
                )}
                <span className="hidden sm:inline">{s}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${step > idx ? "bg-emerald-300" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Step 0: Employment Type */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 className="text-sm font-semibold text-slate-700 mb-1">What describes you best?</h4>
            <p className="text-xs text-slate-500 mb-4">Select your employment category to get a tailored document checklist</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {employmentOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEmploymentType(opt.value)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    employmentType === opt.value
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    employmentType === opt.value
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {opt.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{opt.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 1: Income Sources */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 className="text-sm font-semibold text-slate-700 mb-1">What are your income sources?</h4>
            <p className="text-xs text-slate-500 mb-4">Select all that apply to you</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {incomeSourceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleIncomeSource(opt.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    incomeSources.includes(opt.value)
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    incomeSources.includes(opt.value)
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {opt.icon}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                  {incomeSources.includes(opt.value) && (
                    <CheckCircle2 className="w-4 h-4 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Deductions (old regime only) */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {regime === "new" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">New Tax Regime Selected</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No deductions are applicable in the new tax regime. Click Continue to generate your checklist.
                </p>
              </div>
            ) : (
              <>
                <h4 className="text-sm font-semibold text-slate-700 mb-1">Which deductions do you claim?</h4>
                <p className="text-xs text-slate-500 mb-4">Select the deductions you plan to claim (old regime)</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {deductionOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleDeduction(opt.value)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        deductions.includes(opt.value)
                          ? "border-emerald-500 bg-emerald-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        deductions.includes(opt.value)
                          ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {opt.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                      {deductions.includes(opt.value) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Step 3: Generated Checklist */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span>Checklist Progress</span>
                <span className="font-semibold text-slate-700">
                  {completedCount} / {totalCount} completed
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              {/* Required documents */}
              <div>
                <h5 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  Required Documents
                </h5>
                <div className="space-y-1.5">
                  {requiredChecklist.map((item) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => toggleChecked(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        checkedItems.has(item.id)
                          ? "bg-emerald-50 border border-emerald-200"
                          : "bg-white border border-slate-200 hover:border-blue-200"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                        checkedItems.has(item.id)
                          ? "bg-emerald-500 text-white"
                          : "border-2 border-slate-300"
                      }`}>
                        {checkedItems.has(item.id) && (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0 text-white">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${checkedItems.has(item.id) ? "text-emerald-700 line-through" : "text-slate-800"}`}>
                          {item.label}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.details}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Optional documents */}
              {optionalChecklist.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider mt-4">
                    Optional (if applicable)
                  </h5>
                  <div className="space-y-1.5">
                    {optionalChecklist.map((item) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => toggleChecked(item.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                          checkedItems.has(item.id)
                            ? "bg-slate-50 border border-slate-200"
                            : "bg-white border border-slate-200 hover:border-blue-200"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          checkedItems.has(item.id)
                            ? "bg-slate-400 text-white"
                            : "border-2 border-slate-300"
                        }`}>
                          {checkedItems.has(item.id) && (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0 text-slate-500">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${checkedItems.has(item.id) ? "text-slate-500 line-through" : "text-slate-700"}`}>
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{item.details}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Print button */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print Checklist
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                Generate New
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex items-center justify-between">
        <button
          onClick={() => step > 0 && setStep(step - 1)}
          className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
            step > 0
              ? "text-slate-600 hover:bg-slate-100"
              : "text-slate-300 cursor-not-allowed"
          }`}
          disabled={step === 0}
        >
          ← Back
        </button>
        <button
          onClick={() => {
            if (step < 3) {
              if (step === 2 && regime === "new") {
                setStep(3);
              } else {
                setStep(step + 1);
              }
            }
          }}
          disabled={!canProceed()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            canProceed() && step < 3
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {step === 3 ? "✅ Complete" : `Continue →`}
        </button>
      </div>
    </div>
  );
}
