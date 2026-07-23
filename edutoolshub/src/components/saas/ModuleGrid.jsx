"use client";

import { motion } from "framer-motion";
import { SaasIcon } from "./icons";
import SectionHeading from "./SectionHeading";
import AnimatedCard from "./AnimatedCard";

const gradients = [
  "from-teal-500/15 to-cyan-500/5",
  "from-sky-500/15 to-blue-500/5",
  "from-blue-500/15 to-indigo-500/5",
  "from-emerald-500/15 to-teal-500/5",
  "from-cyan-500/15 to-sky-500/5",
  "from-slate-500/10 to-teal-500/10",
];

export default function ModuleGrid({ modules }) {
  return (
    <section id="modules" className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Modules"
          title="Everything your institute needs"
          subtitle="A deep module suite that replaces scattered tools — from admissions to AI question papers."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, i) => (
            <AnimatedCard key={mod.id} delay={(i % 6) * 0.04} className="group h-full">
              <article className="saas-gradient-border relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition duration-300 hover:shadow-xl hover:shadow-teal-500/10 sm:p-6">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-0 transition group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-saas-ink text-teal-300 shadow-lg shadow-saas-ink/20 transition group-hover:scale-110">
                    <SaasIcon name={mod.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-saas-ink">
                    {mod.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {mod.description}
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {mod.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-saas-teal" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}
