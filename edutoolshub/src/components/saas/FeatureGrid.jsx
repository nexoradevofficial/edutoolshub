"use client";

import { motion } from "framer-motion";
import { SaasIcon } from "./icons";

export default function FeatureGrid({ items, columns = 6 }) {
  const colClass =
    columns === 6
      ? "sm:grid-cols-3 lg:grid-cols-6"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-2 gap-3 ${colClass}`}>
      {items.map((item, i) => (
        <motion.div
          key={item.id || item.label || item.title}
          className="group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-100 bg-white px-3 py-5 text-center shadow-sm shadow-slate-100/80 transition hover:-translate-y-1 hover:border-teal-100 hover:shadow-lg hover:shadow-teal-500/10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-sky-50 text-saas-teal ring-1 ring-teal-100/80 transition group-hover:scale-110">
            <SaasIcon name={item.icon} className="h-5 w-5" />
          </span>
          <span className="text-xs font-semibold text-saas-ink sm:text-sm">
            {item.label || item.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
