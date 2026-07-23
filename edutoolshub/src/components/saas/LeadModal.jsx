"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MessageCircle, X } from "lucide-react";
import { SAAS_LEADS_EMAIL, SAAS_WHATSAPP_URL } from "@/constants/site";
import {
  DEFAULT_WA_SUBSCRIPTION_MESSAGE,
  formatNationalNumber,
  getPhoneCountry,
  toE164,
} from "@/lib/phoneCountries";
import CountryPhoneSelect from "./CountryPhoneSelect";

const INSTITUTE_TYPES = [
  "School",
  "College",
  "Academy",
  "University",
  "Coaching Center",
  "Other",
];

const inputClass =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-saas-ink outline-none transition focus:border-saas-teal focus:ring-2 focus:ring-saas-teal/20";

const labelClass = "mb-1.5 block text-sm font-medium text-saas-ink";

const initialForm = {
  name: "",
  email: "",
  countryCode: "PK",
  whatsappNational: "",
  instituteType: INSTITUTE_TYPES[0],
  instituteName: "",
  city: "",
  studentsApprox: "",
  message: "",
};

export default function LeadModal({ open, mode = "quote", productTitle, onClose }) {
  const titleId = useId();
  const firstFieldRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);

  const country = useMemo(() => getPhoneCountry(form.countryCode), [form.countryCode]);
  const e164 = toE164(form.whatsappNational, country);

  const isQuote = mode === "quote";
  const heading = isQuote ? "Request a Quote" : "Start Free Consultation";
  const subtitle = isQuote
    ? "Tell us about your institute — we’ll prepare a tailored quotation."
    : "Share a few details and we’ll schedule a free consultation.";

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    setForm(initialForm);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onCountryChange = (nextCode) => {
    const nextCountry = getPhoneCountry(nextCode);
    setForm((f) => ({
      ...f,
      countryCode: nextCode,
      whatsappNational: formatNationalNumber(f.whatsappNational, nextCountry),
    }));
  };

  const onWhatsAppChange = (e) => {
    setForm((f) => ({
      ...f,
      whatsappNational: formatNationalNumber(e.target.value, country),
    }));
  };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    e164.length > 4 &&
    form.instituteName.trim();

  const buildBody = () =>
    [
      DEFAULT_WA_SUBSCRIPTION_MESSAGE,
      "",
      `Lead type: ${heading}`,
      `Product: ${productTitle || "EduToolsHub SaaS"}`,
      "",
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `WhatsApp: ${e164}`,
      `Country: ${country.name} (+${country.dial})`,
      `Institute type: ${form.instituteType}`,
      `Institute name: ${form.instituteName.trim()}`,
      `City: ${form.city.trim() || "—"}`,
      `Approx. students: ${form.studentsApprox.trim() || "—"}`,
      "",
      "Message:",
      form.message.trim() || "(none)",
    ].join("\n");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const subject = `[EduToolsHub] ${heading} — ${form.instituteName.trim()}`;
    const mailto = `mailto:${SAAS_LEADS_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(buildBody())}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    if (!canSubmit) return;
    const text = encodeURIComponent(buildBody());
    window.open(`${SAAS_WHATSAPP_URL}?text=${text}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 bg-saas-ink/55 backdrop-blur-sm"
            aria-label="Close dialog"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex max-h-[min(94dvh,920px)] w-full max-w-xl flex-col overflow-hidden rounded-t-[1.75rem] border border-white/50 bg-white shadow-2xl shadow-saas-ink/25 sm:max-h-[90vh] sm:rounded-3xl"
            initial={{ y: 48, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 28, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Header */}
            <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-teal-50/50 px-4 py-4 sm:px-6 sm:py-5">
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-saas-teal/15 blur-3xl" />
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 pr-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-saas-teal">
                    EduToolsHub SaaS
                  </p>
                  <h2
                    id={titleId}
                    className="mt-1 text-lg font-bold tracking-tight text-saas-ink sm:text-xl"
                  >
                    {heading}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-saas-ink"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 grid gap-2 rounded-2xl border border-teal-100/80 bg-white/90 p-2.5 text-[11px] text-slate-600 sm:mt-4 sm:grid-cols-2 sm:gap-3 sm:p-3 sm:text-xs">
                <p className="flex items-start gap-2 rounded-xl bg-teal-50/60 px-2.5 py-2">
                  <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saas-teal" />
                  <span>
                    <strong className="text-saas-ink">WhatsApp</strong> — handled quickly
                  </span>
                </p>
                <p className="flex items-start gap-2 rounded-xl bg-sky-50/60 px-2.5 py-2">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>
                    <strong className="text-saas-ink">Email</strong> — reply within 24 hours
                  </span>
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5">
              {submitted ? (
                <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5 text-center sm:p-6">
                  <p className="text-lg font-semibold text-saas-ink">Thank you!</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Your email client or WhatsApp should open with the details. If it didn’t,
                    write to{" "}
                    <a
                      href={`mailto:${SAAS_LEADS_EMAIL}`}
                      className="font-medium text-saas-teal underline-offset-2 hover:underline"
                    >
                      {SAAS_LEADS_EMAIL}
                    </a>
                    .
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-5 rounded-xl bg-saas-ink px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-3.5 sm:space-y-4">
                  <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="lead-name">
                        Full name *
                      </label>
                      <input
                        ref={firstFieldRef}
                        id="lead-name"
                        className={inputClass}
                        value={form.name}
                        onChange={update("name")}
                        required
                        autoComplete="name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="lead-email">
                        Email *
                      </label>
                      <input
                        id="lead-email"
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={update("email")}
                        required
                        autoComplete="email"
                      />
                    </div>

                    {/* Country + WhatsApp */}
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="lead-country">
                        WhatsApp number *
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <CountryPhoneSelect
                          id="lead-country"
                          value={form.countryCode}
                          onChange={onCountryChange}
                        />
                        <div className="relative min-w-0 flex-1">
                          <span className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-sm font-medium tabular-nums text-slate-400">
                            +{country.dial}
                          </span>
                          <input
                            id="lead-whatsapp"
                            type="tel"
                            inputMode="numeric"
                            className={`${inputClass} ${
                              country.dial.length >= 3 ? "pl-[4.25rem]" : "pl-14"
                            }`}
                            placeholder={country.placeholder}
                            value={form.whatsappNational}
                            onChange={onWhatsAppChange}
                            required
                            autoComplete="tel-national"
                            aria-describedby="lead-whatsapp-hint"
                          />
                        </div>
                      </div>
                      <p id="lead-whatsapp-hint" className="mt-1.5 text-[11px] text-slate-400">
                        Search &amp; select country first — number format updates automatically.
                        Preview:{" "}
                        <span className="font-medium text-slate-600">
                          {e164 || `+${country.dial} …`}
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="lead-type">
                        Institute type *
                      </label>
                      <select
                        id="lead-type"
                        className={inputClass}
                        value={form.instituteType}
                        onChange={update("instituteType")}
                      >
                        {INSTITUTE_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="lead-inst">
                        Institute name *
                      </label>
                      <input
                        id="lead-inst"
                        className={inputClass}
                        value={form.instituteName}
                        onChange={update("instituteName")}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="lead-city">
                        City
                      </label>
                      <input
                        id="lead-city"
                        className={inputClass}
                        value={form.city}
                        onChange={update("city")}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="lead-students">
                        Approx. students
                      </label>
                      <input
                        id="lead-students"
                        className={inputClass}
                        placeholder="e.g. 500"
                        value={form.studentsApprox}
                        onChange={update("studentsApprox")}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} htmlFor="lead-msg">
                        Message
                      </label>
                      <textarea
                        id="lead-msg"
                        rows={3}
                        className={`${inputClass} resize-y`}
                        value={form.message}
                        onChange={update("message")}
                        placeholder="Tell us about campuses, current software, or must-have modules…"
                      />
                    </div>
                  </div>

                  <div className="sticky bottom-0 -mx-4 border-t border-slate-100 bg-white/95 px-4 pb-1 pt-3 backdrop-blur sm:-mx-6 sm:px-6">
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="submit"
                        disabled={!canSubmit}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-saas-ink px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-saas-ink/20 transition hover:bg-saas-ink-soft disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Send via Email
                      </button>
                      <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={handleWhatsApp}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-saas-teal-dark transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Send via WhatsApp
                      </button>
                    </div>
                    <p className="mt-2 pb-2 text-center text-[11px] text-slate-400">
                      Forms are delivered to {SAAS_LEADS_EMAIL}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
