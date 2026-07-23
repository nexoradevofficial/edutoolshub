"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function UsedBy({ usedBy }) {
  return (
    <section className="border-y border-slate-100 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frequently used by"
          title="Built for every kind of institute"
        />
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {usedBy.map((label, i) => (
            <motion.span
              key={label}
              className="rounded-full border border-slate-200 bg-saas-mist px-5 py-2.5 text-sm font-semibold text-saas-ink shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }}
            >
              {label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
