"use client";

import { motion } from "framer-motion";
import { Headset } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function TechSupport({ support }) {
  return (
    <section className="relative overflow-hidden bg-saas-ink py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.12),_transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          light
          eyebrow="Support"
          title={support.title}
          subtitle={support.description}
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {support.points.map((point, i) => (
            <motion.div
              key={point}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Headset className="mt-0.5 h-5 w-5 shrink-0 text-teal-300" />
              <span className="text-sm text-slate-200">{point}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
