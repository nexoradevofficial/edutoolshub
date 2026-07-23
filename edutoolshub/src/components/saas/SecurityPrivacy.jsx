"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function SecurityPrivacy({ security }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            align="left"
            eyebrow="Security"
            title={security.title}
            subtitle={security.description}
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {security.points.map((point, i) => (
              <motion.li
                key={point}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-saas-mist/70 p-4"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saas-teal" />
                <span className="text-sm font-medium text-saas-ink">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
