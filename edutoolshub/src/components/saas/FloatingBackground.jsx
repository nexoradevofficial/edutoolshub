"use client";

import { motion } from "framer-motion";

export default function FloatingBackground({ variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={`absolute inset-0 saas-grid-bg ${isDark ? "opacity-20" : "opacity-60"}`}
      />
      <motion.div
        className={`saas-animated-gradient absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full blur-3xl ${
          isDark
            ? "bg-gradient-to-br from-teal-500/25 via-sky-500/10 to-transparent"
            : "bg-gradient-to-br from-teal-400/30 via-sky-300/20 to-transparent"
        }`}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`saas-animated-gradient absolute -right-20 bottom-0 h-[26rem] w-[26rem] rounded-full blur-3xl ${
          isDark
            ? "bg-gradient-to-tl from-blue-500/20 via-cyan-400/10 to-transparent"
            : "bg-gradient-to-tl from-blue-500/20 via-cyan-300/25 to-transparent"
        }`}
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className={`saas-float absolute left-[12%] top-[28%] h-3 w-3 rounded-full ${
          isDark ? "bg-teal-300/40" : "bg-saas-teal/40"
        }`}
      />
      <div
        className={`saas-float absolute right-[18%] top-[18%] h-2 w-2 rounded-full ${
          isDark ? "bg-sky-300/50" : "bg-sky-400/50"
        }`}
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className={`saas-float absolute bottom-[22%] left-[40%] h-2.5 w-2.5 rounded-full ${
          isDark ? "bg-blue-300/30" : "bg-blue-500/30"
        }`}
        style={{ animationDelay: "2.4s" }}
      />
    </div>
  );
}
