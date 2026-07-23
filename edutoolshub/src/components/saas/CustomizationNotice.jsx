"use client";

import { motion } from "framer-motion";
import { Wrench } from "lucide-react";
import { useLeadModal } from "./LeadModalProvider";

export default function CustomizationNotice({ customization }) {
  const { openQuote } = useLeadModal();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="saas-gradient-border relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-8 sm:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-saas-ink text-teal-300">
                <Wrench className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-saas-ink">
                {customization.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                {customization.description}
              </p>
              <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
                {customization.note}
              </p>
            </div>
            <button
              type="button"
              onClick={openQuote}
              className="shrink-0 rounded-2xl bg-saas-ink px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
            >
              Request a Quote
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
