"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Sparkles } from "lucide-react";
import { CONTACT_EMAIL } from "@/constants/site";
import { useLeadModal } from "./LeadModalProvider";

export default function CTASection({ cta, buttons, footerCta }) {
  const { openConsult } = useLeadModal();
  const demoHref = `mailto:${buttons.demoEmail.to}?subject=${encodeURIComponent(
    buttons.demoEmail.subject
  )}&body=${encodeURIComponent(buttons.demoEmail.body)}`;
  const waHref = `${buttons.whatsapp.url}?text=${encodeURIComponent(buttons.whatsapp.message)}`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-saas-teal to-sky-600 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0 saas-grid-bg opacity-20" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="mx-auto h-8 w-8 text-white/80" />
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {cta.title}
            </h2>
            <p className="mt-4 text-base text-teal-50 sm:text-lg">{cta.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={demoHref}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-saas-ink shadow-lg transition hover:-translate-y-0.5"
              >
                Book Free Demo
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Mail className="h-4 w-4" />
                Email Us
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {footerCta && (
        <section className="border-t border-slate-100 bg-white py-16">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-saas-ink">
                {footerCta.title}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-500 sm:text-base">
                {footerCta.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={openConsult}
              className="rounded-2xl bg-saas-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-saas-ink/20 transition hover:-translate-y-0.5"
            >
              Start Free Consultation
            </button>
          </div>
        </section>
      )}
    </>
  );
}
