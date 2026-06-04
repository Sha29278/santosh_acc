"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  FileText,
  Briefcase,
  Building2,
  IndianRupee,
  Landmark,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────

type EmploymentType = "salaried" | "business" | "professional" | "freelancer" | "retired" | "student";
type IncomeSources = ("salary" | "rental" | "capitalGains" | "interest" | "business" | "foreign" | "other")[];
type IncomeRange = "below25" | "25to50" | "50to1cr" | "above1cr";

interface ItrRecommendation {
  form: string;
  name: string;
  description: string;
  color: string;
  reason: string;
  documents: string[];
  dueDate: string;
}

// ─── Questions Data ──────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: "entity",
    question: "What describes you best?",
    subtitle: "Select your taxpayer type",
    icon: <Briefcase className="w-6 h-6" />,
    options: [
      { value: "individual", label: "Individual / HUF", desc: "Salaried person, freelancer, or family trust", emoji: "👤" },
      { value: "firm", label: "Firm / LLP", desc: "Partnership firm or Limited Liability Partnership", emoji: "🏢" },
      { value: "company", label: "Company", desc: "Private Ltd, Public Ltd, or OPC", emoji: "🏛️" },
      { value: "trust", label: "Trust / Political Party", desc: "Charitable trust, religious trust, or political party", emoji: "🤝" },
      { value: "coop", label: "Cooperative Society", desc: "Housing society or cooperative bank", emoji: "🤲" },
    ],
  },
  {
    id: "sources",
    question: "What are your income sources?",
    subtitle: "Select all that apply",
    icon: <IndianRupee className="w-6 h-6" />,
    multiSelect: true as const,
    options: [
      { value: "salary" as const, label: "Salary / Pension", desc: "Employment income", emoji: "💼" },
      { value: "rental" as const, label: "Rental Income", desc: "Income from house property", emoji: "🏠" },
      { value: "capitalGains" as const, label: "Capital Gains", desc: "Stocks, property, mutual funds", emoji: "📈" },
      { value: "interest" as const, label: "Interest Income", desc: "FD, savings account, bonds", emoji: "🏦" },
      { value: "business" as const, label: "Business / Professional", desc: "Business or professional income", emoji: "📊" },
      { value: "foreign" as const, label: "Foreign Assets", desc: "Foreign income, assets, or accounts", emoji: "🌍" },
      { value: "other" as const, label: "Other Sources", desc: "Lottery, gifts, dividends, etc.", emoji: "🎲" },
    ],
  },
  {
    id: "income",
    question: "What is your total monthly turnover?",
    subtitle: "This helps determine which ITR form applies to you",
    icon: <Landmark className="w-6 h-6" />,
    options: [
      { value: "below25", label: "Up to ₹25 Lakhs", desc: "Eligible for ITR-1 (Sahaj) if salaried", emoji: "💰" },
      { value: "25to50", label: "₹25 Lakhs – ₹50 Lakhs", desc: "May need ITR-2 if capital gains apply", emoji: "💰💰" },
      { value: "50to1cr", label: "₹50 Lakhs – ₹1 Crore", desc: "Higher reporting requirements", emoji: "💰💰💰" },
      { value: "above1cr", label: "Above ₹1 Crore", desc: "Detailed reporting & audit likely needed", emoji: "💰💰💰💰" },
    ],
  },
];

// ─── Recommendation Engine ───────────────────────────────────────────────

function getRecommendation(
  entity: string,
  sources: string[],
  incomeRange: string,
): ItrRecommendation {
  const hasBusiness = sources.includes("business");
  const hasCapitalGains = sources.includes("capitalGains");
  const hasForeign = sources.includes("foreign");
  const hasRental = sources.includes("rental");
  const hasSalary = sources.includes("salary");
  const hasOther = sources.includes("other");
  const isHighIncome = incomeRange === "above1cr" || incomeRange === "50to1cr";

  // Trusts & Political Parties
  if (entity === "trust") {
    return {
      form: "ITR-7",
      name: "ITR-7",
      description: "For trusts, political parties, research associations, and universities",
      color: "from-amber-600 to-orange-600",
      reason: "You selected trust/political party entity type, which falls under sections 139(4A) to 139(4D).",
      documents: ["Audited accounts", "Income & Expenditure statement", "Balance sheet", "TDS certificates", "Form 10B/10BB audit report"],
      dueDate: "31 October (with audit) / 31 July (without audit)",
    };
  }

  // Companies
  if (entity === "company") {
    return {
      form: "ITR-6",
      name: "ITR-6",
      description: "For all registered companies (except those claiming exemption u/s 11)",
      color: "from-rose-600 to-pink-600",
      reason: "You selected company as your entity type. ITR-6 is the designated form for all companies.",
      documents: ["Audited financial statements", "Board resolution", "Tax audit report (if applicable)", "TDS/TCS statements", "Transfer pricing report"],
      dueDate: "31 October (with audit) / 31 July (without audit)",
    };
  }

  // Firms & LLPs
  if (entity === "firm") {
    return {
      form: "ITR-5",
      name: "ITR-5",
      description: "For firms, LLPs, AOPs, BOIs, and cooperative societies",
      color: "from-purple-600 to-violet-600",
      reason: "You selected firm/LLP as your entity type. ITR-5 applies to all partnership entities.",
      documents: ["Audited accounts (if turnover exceeds limits)", "Partnership deed", "TDS certificates", "Tax audit report", "Balance sheet & P&L"],
      dueDate: "31 October (with audit) / 31 July (without audit)",
    };
  }

  // Cooperative Societies
  if (entity === "coop") {
    return {
      form: "ITR-5",
      name: "ITR-5",
      description: "For cooperative societies (filing under ITR-5)",
      color: "from-violet-600 to-purple-600",
      reason: "Cooperative societies file their returns using ITR-5.",
      documents: ["Audited accounts", "By-laws of society", "TDS certificates", "Tax audit report"],
      dueDate: "31 October (with audit) / 31 July (without audit)",
    };
  }

  // Individuals / HUFs
  const isPresumptive = hasBusiness && !hasCapitalGains && !hasForeign && !hasRental && incomeRange === "below25";

  if (hasBusiness && !isPresumptive) {
    // Business income, not presumptive → ITR-3
    return {
      form: "ITR-3",
      name: "ITR-3",
      description: "For individuals & HUFs with business or professional income",
      color: "from-blue-600 to-cyan-600",
      reason: "You have business or professional income (along with possible other sources). ITR-3 is required.",
      documents: ["Audited financial statements (if turnover > limits)", "Tax audit report (if applicable)", "TDS certificates (Form 16/16A)", "Balance sheet & P&L statement", "Capital gains calculations", "Foreign asset details"],
      dueDate: "31 October (with audit) / 31 July (without audit)",
    };
  }

  if (isPresumptive) {
    // Presumptive business income → ITR-4
    return {
      form: "ITR-4 (Sugam)",
      name: "ITR-4 (Sugam)",
      description: "For individuals with presumptive business/professional income u/s 44AD/44ADA",
      color: "from-emerald-600 to-teal-600",
      reason: "You have presumptive business income under ₹2Cr (business) or ₹50L (profession) with no capital gains or foreign income. ITR-4 (Sugam) is ideal.",
      documents: ["Estimated P&L statement", "TDS certificates", "Bank statements", "Proof of turnover"],
      dueDate: "31 July",
    };
  }

  if (hasForeign) {
    // Foreign income/assets → ITR-2 (not eligible for ITR-1)
    return {
      form: "ITR-2",
      name: "ITR-2",
      description: "For individuals & HUFs with foreign assets, capital gains, or multiple properties",
      color: "from-indigo-600 to-blue-600",
      reason: "You have foreign assets or income, which disqualifies you from using ITR-1 (Sahaj). ITR-2 is the correct form.",
      documents: ["Form 16 (salary)", "Capital gains statements", "Foreign asset schedule (Schedule FA)", "TDS certificates", "Rent receipts/agreements", "Bank statements (foreign)"],
      dueDate: "31 July",
    };
  }

  if (hasCapitalGains || hasRental || hasOther || isHighIncome) {
    // Capital gains, rental, "other" income, or high income → ITR-2
    return {
      form: "ITR-2",
      name: "ITR-2",
      description: "For individuals & HUFs with capital gains, multiple properties, or foreign income",
      color: "from-indigo-600 to-blue-600",
      reason: hasCapitalGains
        ? "You have capital gains from stocks/property, which requires detailed reporting in ITR-2."
        : hasRental
          ? "You have rental income from house property, requiring ITR-2 for detailed disclosures."
          : "Your total income exceeds ₹50L or you have other income sources, requiring ITR-2.",
      documents: ["Form 16 (salary)", "Capital gains statements", "TDS certificates", "Property documents (rental)", "Bank interest certificates", "Bank statements"],
      dueDate: "31 July",
    };
  }

  // Default: ITR-1 (Sahaj)
  return {
    form: "ITR-1 (Sahaj)",
    name: "ITR-1 (Sahaj)",
    description: "Simplest form for salaried individuals, pensioners, and interest income",
    color: "from-blue-600 to-indigo-600",
    reason: "You have only salary/pension and interest income within ₹50L — the perfect fit for ITR-1 (Sahaj)!",
    documents: ["Form 16 (from employer)", "Bank interest certificates", "TDS certificates (if any)", "Form 26AS / AIS statement", "Previous year ITR acknowledgment"],
    dueDate: "31 July",
  };
}

// ─── Main Component ──────────────────────────────────────────────────────

export default function ItrQuiz() {
  const [step, setStep] = useState(0);
  const [entity, setEntity] = useState<string>("");
  const [sources, setSources] = useState<string[]>([]);
  const [incomeRange, setIncomeRange] = useState<string>("");
  const [completed, setCompleted] = useState(false);

  const recommendation = useMemo(() => {
    if (!completed) return null;
    return getRecommendation(entity, sources, incomeRange);
  }, [completed, entity, sources, incomeRange]);

  const canProceed = () => {
    if (step === 0) return entity !== "";
    if (step === 1) return sources.length > 0;
    if (step === 2) return incomeRange !== "";
    return true;
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setEntity("");
    setSources([]);
    setIncomeRange("");
    setCompleted(false);
  };

  const toggleSource = (value: string) => {
    setSources((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Which ITR Form Should You File?</h3>
            <p className="text-xs text-blue-200">Answer 3 quick questions to find out</p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {!completed ? (
          <>
            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-6">
              {QUESTIONS.map((q, idx) => (
                <div key={q.id} className="flex-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx <= step
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : "bg-slate-200"
                    }`}
                  />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                      {QUESTIONS[step].icon}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{QUESTIONS[step].question}</h4>
                      <p className="text-xs text-slate-500">{QUESTIONS[step].subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {QUESTIONS[step].options.map((opt: any) => {
                    const isSelected = QUESTIONS[step].multiSelect
                      ? sources.includes(opt.value)
                      : step === 0
                        ? entity === opt.value
                        : incomeRange === opt.value;

                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (QUESTIONS[step].multiSelect) {
                            toggleSource(opt.value);
                          } else if (step === 0) {
                            setEntity(opt.value);
                          } else {
                            setIncomeRange(opt.value);
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{opt.emoji}</span>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                            <p className="text-xs text-slate-500">{opt.desc}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-slate-300"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <div className="text-xs text-slate-400">
                Step {step + 1} of {QUESTIONS.length}
              </div>

              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
              >
                {step === QUESTIONS.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get Recommendation
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </>
        ) : recommendation ? (
          /* Results */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-4">
              <Check className="w-3.5 h-3.5" />
              Your Recommended Form
            </div>

            <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${recommendation.color} flex items-center justify-center shadow-lg mb-3`}>
              <FileText className="w-8 h-8 text-white" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-1">{recommendation.name}</h4>
            <p className="text-sm text-slate-500 mb-2">{recommendation.description}</p>

            <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100 text-left">
              <p className="text-xs font-semibold text-blue-700 mb-1">Why this form?</p>
              <p className="text-xs text-slate-600 leading-relaxed">{recommendation.reason}</p>
            </div>

            {/* Documents needed */}
            <div className="text-left mb-4">
              <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <span className="text-base">📋</span>
                Documents you'll need
              </p>
              <div className="flex flex-wrap gap-1.5">
                {recommendation.documents.map((doc, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-600"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-left mb-4">
              <div className="flex items-center gap-2">
                <span className="text-base">📅</span>
                <div>
                  <p className="text-xs font-semibold text-amber-800">Due Date</p>
                  <p className="text-xs text-amber-700">{recommendation.dueDate}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start Over
            </button>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
