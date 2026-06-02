"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, RefreshCw, Copy, Check, ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<"confirm" | "done">("confirm");
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to reset password.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setNewPassword(data.newPassword);
      setStep("done");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
              step === "confirm"
                ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-200"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-200"
            }`}>
              {step === "confirm" ? (
                <KeyRound className="w-7 h-7 text-white" />
              ) : (
                <RefreshCw className="w-7 h-7 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {step === "confirm" ? "Reset Password" : "Password Reset Successful"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {step === "confirm"
                ? "This will generate a new admin password. Make sure to save it."
                : "Your new password has been generated. Save it somewhere secure."}
            </p>
          </div>

          {step === "confirm" ? (
            /* Confirmation step */
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Are you sure?</p>
                    <p>Resetting the password will immediately invalidate the current password. You will need to use the new password to log in.</p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all disabled:opacity-50 shadow-lg shadow-amber-200"
              >
                {loading ? "Generating..." : "Reset Password"}
              </button>

              <div className="text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            /* New password display */
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
                <label className="block text-xs font-medium text-emerald-700 mb-2 uppercase tracking-wider">
                  Your New Password
                </label>
                <div className="bg-white rounded-xl border border-emerald-200 p-4 font-mono text-lg text-center font-bold text-slate-900 break-all select-all">
                  {newPassword}
                </div>
                <button
                  onClick={copyPassword}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Password
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Save this password now. You won&apos;t be able to see it again after
                  leaving this page.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/admin/login")}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200"
                >
                  Go to Login
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-all text-sm"
                >
                  Generate Another Password
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
