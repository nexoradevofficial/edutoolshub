"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Play } from "lucide-react";
import FloatingBackground from "./FloatingBackground";
import { useLeadModal } from "./LeadModalProvider";

function mailtoDemo(buttons) {
  const { to, subject, body } = buttons.demoEmail;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function whatsappHref(buttons) {
  return `${buttons.whatsapp.url}?text=${encodeURIComponent(buttons.whatsapp.message)}`;
}

function DashboardMockup({ images }) {
  const heroSrc = images?.hero || images?.dashboard;

  return (
    <motion.div
      className="relative mx-auto w-full max-w-xl"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/30 via-sky-400/20 to-blue-500/30 blur-2xl" />
      <div className="saas-gradient-border relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-2xl shadow-slate-900/15">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 h-2 flex-1 rounded-full bg-slate-200" />
          <span className="text-[10px] font-medium text-slate-400">Admin console</span>
        </div>
        <div className="relative aspect-[16/10] bg-slate-100">
          {heroSrc ? (
            <Image
              src={heroSrc}
              alt="School & College Management System dashboard"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 560px"
              priority
            />
          ) : null}
        </div>
      </div>

      <motion.div
        className="saas-glass absolute -left-2 top-16 hidden overflow-hidden rounded-2xl border border-white/70 shadow-xl sm:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {images?.mobile ? (
          <div className="relative h-36 w-20">
            <Image
              src={images.mobile}
              alt="Mobile dashboard preview"
              fill
              className="object-cover object-top"
              sizes="80px"
            />
          </div>
        ) : (
          <div className="px-3 py-2">
            <p className="text-[10px] text-slate-500">QR Fee Voucher</p>
            <p className="text-xs font-bold text-saas-ink">Scan ready ✓</p>
          </div>
        )}
      </motion.div>
      <motion.div
        className="saas-glass absolute -right-1 bottom-16 hidden rounded-2xl border border-white/70 px-3 py-2 shadow-xl sm:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[10px] text-slate-500">WhatsApp</p>
        <p className="text-xs font-bold text-saas-teal">QR messaging</p>
      </motion.div>
    </motion.div>
  );
}

export default function SaaSHero({ product }) {
  const { openQuote, openConsult } = useLeadModal();
  const { hero, buttons, images } = product;

  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-[#f8fafc]">
      <FloatingBackground />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:py-24">
        <div>
          <motion.p
            className="text-xs font-semibold uppercase tracking-[0.22em] text-saas-teal"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            EduToolsHub · Enterprise SaaS
          </motion.p>
          <motion.h1
            className="mt-4 text-balance text-4xl font-bold tracking-tight text-saas-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
          >
            {hero.heading}
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-500 sm:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
          >
            {hero.subheading}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              href={mailtoDemo(buttons)}
              className="inline-flex items-center gap-2 rounded-2xl bg-saas-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-saas-ink/25 transition hover:-translate-y-0.5 hover:bg-saas-ink-soft"
            >
              <Play className="h-4 w-4" />
              {hero.ctaPrimary}
            </a>
            <a
              href={whatsappHref(buttons)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-semibold text-saas-teal-dark transition hover:-translate-y-0.5 hover:bg-teal-100"
            >
              <MessageCircle className="h-4 w-4" />
              {hero.ctaSecondary}
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-saas-ink transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              {hero.ctaTertiary}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-wrap gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <button
              type="button"
              onClick={openQuote}
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 backdrop-blur transition hover:border-teal-200 hover:text-saas-teal"
            >
              Request a Quote
            </button>
            <button
              type="button"
              onClick={openConsult}
              className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 backdrop-blur transition hover:border-teal-200 hover:text-saas-teal"
            >
              Start Free Consultation
            </button>
          </motion.div>
        </div>

        <DashboardMockup images={images} />
      </div>
    </section>
  );
}
