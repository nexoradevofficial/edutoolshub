"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Cloud, CreditCard } from "lucide-react";
import AnimatedCard from "./AnimatedCard";

function CardIllustration({ title, src }) {
  if (src) {
    return (
      <div className="relative h-48 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-100">
        <Image
          src={src}
          alt={`${title} preview`}
          fill
          className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-saas-ink/25 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-saas-ink via-slate-800 to-teal-900">
      <div className="absolute inset-0 saas-grid-bg opacity-30" />
      <span className="sr-only">{title} illustration</span>
    </div>
  );
}

export default function SaaSProductCard({ product, index = 0 }) {
  return (
    <AnimatedCard delay={index * 0.08} className="group h-full perspective-[1200px]">
      <Link
        href={`/saas/${product.slug}`}
        className="saas-gradient-border relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/40 transition duration-300 hover:border-teal-200/80 hover:shadow-2xl hover:shadow-teal-500/10 sm:p-6"
      >
        <CardIllustration title={product.title} src={product.images?.card || product.images?.laptop} />

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-saas-teal-dark ring-1 ring-teal-100">
            {product.categoryBadge}
          </span>
          <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-100">
            {product.category}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-saas-ink transition group-hover:text-saas-teal-dark">
          {product.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{product.subtitle}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {product.cardFeatures.slice(0, 8).map((f) => (
            <li
              key={f}
              className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-100"
            >
              {f}
            </li>
          ))}
          {product.cardFeatures.length > 8 && (
            <li className="rounded-lg bg-teal-50 px-2 py-1 text-[11px] font-semibold text-saas-teal">
              +{product.cardFeatures.length - 8} more
            </li>
          )}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Cloud className="h-3.5 w-3.5 text-saas-teal" />
            {product.techBadge}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CreditCard className="h-3.5 w-3.5 text-primary" />
            {product.billingBadge}
          </span>
        </div>

        <motion.span
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-saas-ink"
          whileHover={{ x: 4 }}
        >
          View Solution
          <ArrowRight className="h-4 w-4 text-saas-teal transition group-hover:translate-x-1" />
        </motion.span>
      </Link>
    </AnimatedCard>
  );
}
