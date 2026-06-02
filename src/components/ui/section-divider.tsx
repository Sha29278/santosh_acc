"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "wave" | "curve" | "angle" | "circle";
  fromColor?: string;
  toColor?: string;
}

export default function SectionDivider({
  variant = "wave",
  fromColor = "#2563EB",
  toColor = "#6366F1",
}: SectionDividerProps) {
  if (variant === "circle") {
    return (
      <div className="relative h-24 -mt-12 -mb-12 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg border border-white/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 animate-pulse" style={{ animationDuration: "3s" }} />
          </div>
        </motion.div>
      </div>
    );
  }

  if (variant === "angle") {
    return (
      <div className="relative h-24 -mb-1 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-16"
        >
          <defs>
            <linearGradient id="angleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fromColor} stopOpacity="0.08" />
              <stop offset="50%" stopColor={toColor} stopOpacity="0.12" />
              <stop offset="100%" stopColor={fromColor} stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <motion.polygon
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            fill="url(#angleGrad)"
            points="0,60 1440,0 1440,60 0,60"
          />
        </svg>
      </div>
    );
  }

  if (variant === "curve") {
    return (
      <div className="relative h-24 -mb-1 overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-20"
        >
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={fromColor} stopOpacity="0.06" />
              <stop offset="50%" stopColor={toColor} stopOpacity="0.1" />
              <stop offset="100%" stopColor={fromColor} stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            fill="url(#curveGrad)"
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    );
  }

  // Default wave
  return (
    <div className="relative h-24 -mb-1 overflow-hidden pointer-events-none">
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.06" />
            <stop offset="25%" stopColor={toColor} stopOpacity="0.1" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.08" />
            <stop offset="75%" stopColor={toColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={fromColor} stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.03" />
            <stop offset="50%" stopColor={toColor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={fromColor} stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#waveGrad)"
          d="M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z"
          animate={{
            d: [
              "M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z",
              "M0,55 C240,25 480,75 720,40 C960,10 1200,60 1440,45 L1440,100 L0,100 Z",
              "M0,50 C240,80 480,20 720,50 C960,80 1200,20 1440,50 L1440,100 L0,100 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          fill="url(#waveGrad2)"
          d="M0,60 C240,30 480,80 720,60 C960,30 1200,80 1440,60 L1440,100 L0,100 Z"
          animate={{
            d: [
              "M0,60 C240,30 480,80 720,60 C960,30 1200,80 1440,60 L1440,100 L0,100 Z",
              "M0,65 C240,90 480,40 720,70 C960,100 1200,50 1440,65 L1440,100 L0,100 Z",
              "M0,60 C240,30 480,80 720,60 C960,30 1200,80 1440,60 L1440,100 L0,100 Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}
