"use client";

import { useState } from "react";
import Button from "../components/ui/Button";
import { IconArrowRight } from "../components/icons/ToolIcons";

import { CONTACT_EMAIL, SITE_NAME, SITE_URL, DEFAULT_LOGO_PATH } from "../constants/site";

const SUBJECTS = [
  "General inquiry",
  "Tool suggestion",
  "Bug report",
  "School / College Management SaaS demo",
  "SaaS pricing / subscription",
  "Partnership / collaboration",
  "Press / media",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "mb-1 block text-sm font-medium text-text";

const faqs = [
  {
    q: "How long does it take to hear back?",
    a: "We answer most messages within 1–2 business days. Bug reports and partnership inquiries are usually faster.",
  },
  {
    q: "Can I suggest a new tool?",
    a: "Absolutely. Tool suggestions from teachers and students drive most of our roadmap — describe the task you’re trying to make easier and we’ll evaluate it.",
  },
  {
    q: "Do you charge for any of the tools?",
    a: "No. Every tool on EduToolsHub is 100% free with no signup. If a future tool ever needs a paid tier, the existing free tools will stay free.",
  },
  {
    q: "Is my data private when I use the tools?",
    a: "Yes. Most tools run entirely in your browser. We don’t require accounts and don’t sell user data — read the Privacy Policy for full details.",
  },
];

export default function Contact() {
  const canonical = `${SITE_URL}/contact`;
  const title = `Contact Us — ${SITE_NAME}`;
  const description =
    "Get in touch with the EduToolsHub team. Send a tool suggestion, report a bug, ask a question, or explore a partnership. We reply within 1–2 business days.";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const messageTooShort = message.trim().length > 0 && message.trim().length < 10;
  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    message.trim().length >= 10;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    const subjectLine = `[EduToolsHub] ${subject} — ${name.trim()}`;
    const body =
      `Hi EduToolsHub team,\n\n` +
      `${message.trim()}\n\n` +
      `—\n` +
      `Name: ${name.trim()}\n` +
      `Reply-to: ${email.trim()}\n` +
      `Topic: ${subject}`;

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subjectLine
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSent(true);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setSubject(SUBJECTS[0]);
    setMessage("");
    setSent(false);
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_LOGO_PATH}`,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        availableLanguage: ["English"],
        areaServed: "Worldwide",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-16 pb-16 sm:pt-20 sm:pb-20">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Contact Us
          </p>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
            Let’s build better tools — <span className="text-primary">together</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
            Got a question, a tool idea, a bug to report, or want a demo of our{" "}
            <a
              href="/saas/school-college-management-system"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              School &amp; College Management System
            </a>
            ? Drop us a line — WhatsApp queries are handled quickly; email within 24 hours for SaaS.
          </p>
          <p className="mt-4 text-base font-medium text-text">
            Or email us directly at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary hover:text-primary-dark hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="rounded-3xl border border-border bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-text">Send us a message</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Your message will open in your default email app — no data is
                  stored on our servers.
                </p>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        Your name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="e.g. Alex Johnson"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className={labelClass}>
                      Topic
                    </label>
                    <select
                      id="contact-subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={inputClass}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClass}>
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      required
                      placeholder="Tell us what you’re working on, what tool you’re missing, or what isn’t working as expected…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${inputClass} resize-y`}
                    />
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span
                        className={
                          messageTooShort ? "text-red-600" : "text-text-muted"
                        }
                      >
                        {messageTooShort
                          ? "Please write at least 10 characters."
                          : "Minimum 10 characters."}
                      </span>
                      <span className="text-text-muted">
                        {message.trim().length} chars
                      </span>
                    </div>
                  </div>

                  {sent ? (
                    <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                      <p className="text-sm font-semibold text-accent-dark">
                        Your email client should have opened.
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        If nothing appeared, copy our address below and email us
                        directly — we read everything.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {CONTACT_EMAIL}
                        </a>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-text"
                        >
                          Send another message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <Button type="submit" disabled={!canSubmit}>
                        Send message
                        <IconArrowRight />
                      </Button>
                      <p className="text-xs text-text-muted">
                        We’ll never share your email. Read our{" "}
                        <a
                          href="/privacy"
                          className="font-medium text-primary hover:text-primary-dark hover:underline"
                        >
                          Privacy Policy
                        </a>
                        .
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <aside className="lg:col-span-2">
              <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-white to-accent/5 p-6 shadow-sm sm:p-8">
                <h2 className="text-xl font-semibold text-text">Other ways to reach us</h2>
                <p className="mt-1 text-sm text-text-muted">
                  Prefer to skip the form? Use any of these channels.
                </p>

                <ul className="mt-6 space-y-5">
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Email
                    </p>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="mt-1 inline-block text-base font-semibold text-primary hover:text-primary-dark hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Response time
                    </p>
                    <p className="mt-1 text-sm text-text">
                      Within 1–2 business days
                    </p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Languages
                    </p>
                    <p className="mt-1 text-sm text-text">English</p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Available in
                    </p>
                    <p className="mt-1 text-sm text-text">
                      Every country — used by students &amp; teachers worldwide
                    </p>
                  </li>
                  <li>
                    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                      Developed by
                    </p>
                    <a
                      href="https://nexora-dev-official.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
                    >
                      Nexora Dev
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              Common questions
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Before you write, check these
            </h2>
            <p className="mt-3 text-base text-text-muted">
              Most messages can be answered in seconds with one of these.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary/30"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-sm font-semibold text-text">
                  {item.q}
                  <span
                    className="mt-0.5 text-xl leading-none text-text-muted transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-white to-accent/5 p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Or jump straight into the tools
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
              The fastest way to know if {SITE_NAME} is right for you — try it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/tools" size="lg">
                Browse all tools
                <IconArrowRight />
              </Button>
              <Button href="/saas/school-college-management-system" variant="secondary" size="lg">
                School Management SaaS
              </Button>
              <Button href="/about" variant="secondary" size="lg">
                Learn about us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
