interface LogoProps {
  className?: string;
  size?: number;
  showTagline?: boolean;
  tagline?: string;
  dark?: boolean;
}

export default function Logo({ className = "", size = 40, showTagline = false, tagline, dark = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 40 40" width={size} height={size} fill="none" role="img" aria-label="AccTax Solutions">
          <title>AccTax Solutions</title>
          <defs>
            <linearGradient id="ats-logo-gradient" x1="0" y1="0" x2="40" y2="40">
              <stop stopColor="#2563EB" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="10" fill="url(#ats-logo-gradient)" />
          <text x="20" y="26" textAnchor="middle" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="800" letterSpacing="0.5">
            ATS
          </text>
          <rect x="28" y="4" width="10" height="10" rx="3" fill="rgba(255,255,255,0.15)" />
          <text x="33" y="11.5" textAnchor="middle" fill="#FCD34D" fontFamily="system-ui, -apple-system, sans-serif" fontSize="9" fontWeight="bold">
            ₹
          </text>
        </svg>
      </div>
      <div>
        <span className={`text-lg font-bold ${dark ? "text-slate-900" : "text-white"}`}>
          AccTax Solutions
        </span>
        {showTagline && tagline && (
          <span className={`block text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
