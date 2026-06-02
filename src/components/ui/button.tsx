"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "rainbow" | "blue" | "cyan";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer",
          "hover:scale-[1.03] active:scale-[0.97]",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30",
          variant === "secondary" && "bg-blue-700 text-white hover:bg-blue-800 shadow-lg shadow-blue-700/30",
          variant === "blue" && "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30",
          variant === "cyan" && "bg-sky-600 text-white hover:bg-sky-700 shadow-lg shadow-sky-600/30",
          variant === "gold" && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/30",
          variant === "rainbow" && "animated-gradient text-white shadow-lg shadow-blue-600/30 hover:shadow-indigo-600/30",
          variant === "outline" && "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
          variant === "ghost" && "text-blue-600 hover:bg-blue-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
