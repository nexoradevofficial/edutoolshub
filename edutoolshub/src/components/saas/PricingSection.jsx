"use client";

import { motion } from "framer-motion";
import { Check, MessageCircle, Tag } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { useLeadModal } from "./LeadModalProvider";

function formatMoney(amount, currency) {
  if (currency === "USD") {
    return `$${Number(amount).toLocaleString("en-US")}`;
  }
  return `PKR ${Number(amount).toLocaleString("en-PK")}`;
}

export default function PricingSection({ pricing, whatsapp }) {
  const { openQuote } = useLeadModal();
  const plan = pricing.plans?.[0];

  if (!plan) return null;

  const onSale = Boolean(plan.onSale);
  const validUntil = plan.saleValidUntil || pricing.saleValidUntil;

  return (
    <section id="pricing" className="relative overflow-hidden bg-saas-mist py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(13,148,136,0.08),_transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="One simple package — all modules"
          subtitle={pricing.billingNote}
        />

        <motion.article
          className="relative mx-auto mt-12 max-w-xl overflow-hidden rounded-[1.75rem] border border-teal-300/50 bg-saas-ink p-6 text-white shadow-2xl shadow-teal-900/30 sm:mt-14 sm:p-8"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {onSale && (
            <div className="absolute right-4 top-4 flex flex-col items-end gap-1 sm:right-6 sm:top-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-saas-ink shadow-md">
                <Tag className="h-3 w-3" />
                {plan.badge || "50% OFF"}
              </span>
              {validUntil && (
                <span className="text-[10px] font-medium text-teal-200/90">
                  Valid till {validUntil}
                </span>
              )}
            </div>
          )}

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            {plan.name}
          </p>
          <h3 className="mt-2 max-w-[14rem] text-xl font-bold sm:max-w-none sm:text-2xl">
            All modules included
          </h3>

          {onSale && (
            <p className="mt-5 text-sm text-slate-300">
              <span className="mr-2 line-through decoration-rose-300/80 decoration-2">
                {formatMoney(plan.originalPricePkr, "PKR")}
              </span>
              <span className="line-through decoration-rose-300/80 decoration-2">
                {formatMoney(plan.originalPriceUsd, "USD")}
              </span>
              <span className="ml-2 text-xs text-amber-300">/ month</span>
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-end gap-x-4 gap-y-2">
            <div>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                {formatMoney(plan.pricePkr ?? plan.price, "PKR")}
              </p>
              <p className="text-sm text-slate-300">per month</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <p className="text-xl font-bold text-teal-200 sm:text-2xl">
                {formatMoney(plan.priceUsd, "USD")}
              </p>
              <p className="text-xs text-slate-400">approx. / month</p>
            </div>
          </div>

          {onSale && plan.saleNote && (
            <p className="mt-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 text-sm text-amber-100">
              {plan.saleNote}
            </p>
          )}

          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                <span className="text-slate-200">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={openQuote}
              className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-saas-ink shadow-lg transition hover:-translate-y-0.5"
            >
              {plan.cta || "Start Subscription"}
            </button>
            {whatsapp && (
              <a
                href={`${whatsapp.url}?text=${encodeURIComponent(whatsapp.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/5"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        </motion.article>
      </div>
    </section>
  );
}
