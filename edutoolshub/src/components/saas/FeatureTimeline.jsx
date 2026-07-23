"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

export default function FeatureTimeline({ highlights }) {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Highlights"
          title="Engineered for trust at scale"
          subtitle="A product philosophy that favors clarity, speed and security — not clutter."
        />

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-teal-300 via-sky-300 to-transparent md:left-1/2 md:block" />
          <div className="space-y-8 md:space-y-12">
            {highlights.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={item.id}
                  className={`relative flex flex-col gap-3 md:flex-row md:items-center ${
                    left ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: left ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`md:w-1/2 ${left ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <article className="rounded-3xl border border-slate-100 bg-saas-mist/60 p-6 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saas-teal">
                        0{i + 1}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-saas-ink">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        {item.description}
                      </p>
                    </article>
                  </div>
                  <div className="absolute left-4 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-saas-teal ring-4 ring-teal-100 md:left-1/2 md:block" />
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
