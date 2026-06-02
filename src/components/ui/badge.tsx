import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "success" | "info" | "gold" | "purple" | "rainbow";
  className?: string;
}

export default function Badge({ children, variant = "primary", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
        variant === "primary" && "bg-blue-100 text-blue-700",
        variant === "secondary" && "bg-indigo-100 text-indigo-700",
        variant === "accent" && "bg-amber-100 text-amber-700",
        variant === "success" && "bg-emerald-100 text-emerald-700",
        variant === "info" && "bg-sky-100 text-sky-700",
        variant === "gold" && "bg-amber-100 text-amber-700",
        variant === "purple" && "bg-indigo-100 text-indigo-700",
        variant === "rainbow" && "bg-gradient-to-r from-blue-100 via-indigo-100 to-sky-100 text-blue-700",
        className
      )}
    >
      {children}
    </span>
  );
}
