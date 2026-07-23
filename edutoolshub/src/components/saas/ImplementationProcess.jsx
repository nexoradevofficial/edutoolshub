"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function ImplementationProcess({ process }) {
  return (
    <section className="bg-saas-mist py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Implementation"
          title="From first contact to go-live"
          subtitle="A clear five-step process so institutes know exactly what happens next."
        />

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((step, i) => (
            <motion.li
              key={step.step}
              className="relative rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-saas-ink text-sm font-bold text-teal-300">
                {step.step}
              </span>
              <h3 className="mt-4 text-base font-bold text-saas-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
              {i < process.length - 1 && (
                <span className="absolute -right-2 top-1/2 hidden h-px w-4 bg-teal-200 lg:block" />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
