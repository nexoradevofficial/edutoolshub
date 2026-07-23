import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cloud, GraduationCap, MessageCircle, QrCode } from "lucide-react";
import { getSaasBySlug } from "@/data/saasSolutions";

const PRODUCT_SLUG = "school-college-management-system";
const PRODUCT_PATH = `/saas/${PRODUCT_SLUG}`;

const highlights = [
  { icon: GraduationCap, label: "Admissions & Students" },
  { icon: QrCode, label: "QR Attendance & Vouchers" },
  { icon: MessageCircle, label: "WhatsApp Messaging" },
  { icon: Cloud, label: "Cloud Admin & Teacher Portals" },
];

/**
 * Reusable SaaS promo — homepage, tools, about, contact, etc.
 * @param {"full" | "compact" | "banner"} variant
 */
export default function SaasPromoSection({
  variant = "full",
  className = "",
  id = "saas-solutions",
}) {
  const product = getSaasBySlug(PRODUCT_SLUG);
  if (!product) return null;

  if (variant === "banner") {
    return (
      <aside
        className={`border-y border-teal-100 bg-gradient-to-r from-teal-50 via-white to-sky-50 ${className}`}
        aria-label="SaaS product promotion"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-saas-teal">
              New · SaaS Solutions
            </p>
            <p className="mt-1 text-sm font-semibold text-saas-ink sm:text-base">
              {product.title} — cloud ERP for schools &amp; colleges
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={PRODUCT_PATH}
              className="inline-flex items-center gap-1.5 rounded-xl bg-saas-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-saas-ink-soft"
            >
              View product
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/saas"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-saas-ink transition hover:border-teal-200"
            >
              All SaaS
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  if (variant === "compact") {
    return (
      <section
        id={id}
        className={`bg-white py-14 sm:py-16 ${className}`}
        aria-labelledby={`${id}-heading`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-teal-50/40 shadow-sm">
            <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saas-teal">
                  SaaS Solutions
                </p>
                <h2
                  id={`${id}-heading`}
                  className="mt-2 text-2xl font-bold tracking-tight text-saas-ink sm:text-3xl"
                >
                  {product.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Complete cloud ERP for schools and colleges — admissions, fees, QR attendance,
                  WhatsApp messaging, exams, ID cards, and Admin &amp; Teacher portals.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={PRODUCT_PATH}
                    className="inline-flex items-center gap-2 rounded-xl bg-saas-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-saas-ink-soft"
                  >
                    Explore School ERP
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/saas"
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-saas-ink transition hover:border-teal-200"
                  >
                    SaaS marketplace
                  </Link>
                </div>
              </div>
              {product.images?.card && (
                <div className="relative mx-auto hidden aspect-[16/10] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 shadow-lg lg:block">
                  <Image
                    src={product.images.card}
                    alt={`${product.title} dashboard preview`}
                    fill
                    className="object-cover object-top"
                    sizes="400px"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full homepage-style section
  return (
    <section
      id={id}
      className={`relative overflow-hidden bg-saas-ink py-20 text-white sm:py-24 ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(13,148,136,0.25),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 saas-grid-bg opacity-10" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              SaaS Solutions
            </p>
            <h2
              id={`${id}-heading`}
              className="mt-3 text-balance text-3xl font-bold tracking-tight sm:text-4xl"
            >
              School &amp; College Management System
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
              Beyond free tools — EduToolsHub also offers enterprise cloud software. Digitize
              admissions, students, staff, fees, attendance, exams and administration with Admin
              and Teacher portals.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-200"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={PRODUCT_PATH}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-saas-ink shadow-lg transition hover:-translate-y-0.5"
              >
                View School Management System
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/saas"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse SaaS marketplace
              </Link>
            </div>

            {product.pricing?.plans?.[0]?.onSale && (
              <p className="mt-5 text-sm text-amber-200/90">
                August sale · 50% off — from PKR 10,000 / month (approx. $36). Offer till 31 Aug
                2026.
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-teal-400/20 via-sky-400/10 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-slate-900/50 shadow-2xl shadow-black/40">
              <div className="relative aspect-[16/10]">
                <Image
                  src={product.images?.dashboard || product.images?.hero}
                  alt="School and College Management System admin dashboard"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 560px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
