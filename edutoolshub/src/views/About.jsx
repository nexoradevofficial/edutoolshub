import Button from "../components/ui/Button";
import {
  IconArrowRight,
  IconGift,
  IconShield,
  IconUser,
  IconZap,
} from "../components/icons/ToolIcons";
import { activeTools } from "../data/tools";

import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "../constants/site";

const values = [
  {
    icon: IconGift,
    title: "Free forever",
    description:
      "Every tool is 100% free. No paywalls, no trials, no hidden fees — just useful tools you can rely on.",
  },
  {
    icon: IconUser,
    title: "No signup required",
    description:
      "Open a tool and start using it instantly. Your data stays in your browser — we never ask you to create an account.",
  },
  {
    icon: IconShield,
    title: "Privacy first",
    description:
      "We don’t sell your data. Tools run client-side wherever possible, so your grades and class lists never leave your device.",
  },
  {
    icon: IconZap,
    title: "Fast & mobile friendly",
    description:
      "Built to be lightning fast on phones, tablets, and desktops. Get results the moment you need them.",
  },
];

const stats = [
  { value: `${activeTools.length}+`, label: "Tools live today" },
  { value: "100%", label: "Free to use" },
  { value: "0", label: "Accounts required" },
  { value: "Worldwide", label: "Available everywhere" },
];

export default function About() {
  const canonical = `${SITE_URL}/about`;
  const title = `About — ${SITE_NAME}`;
  const description =
    "Learn about EduToolsHub — a free, no-signup collection of smart tools for students and teachers worldwide. Our mission, our values, and what we’re building next.";

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    email: CONTACT_EMAIL,
    sameAs: ["https://nexora-dev-official.vercel.app/"],
    description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-16 pb-20 sm:pt-20 sm:pb-24">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-accent" />
            About {SITE_NAME}
          </p>

          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
            Smart, free tools built for{" "}
            <span className="text-primary">modern classrooms</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
            EduToolsHub is a growing collection of free, no-signup utilities
            that help students and teachers spend less time on busywork — and
            more time on learning.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/tools" size="lg">
              Explore the tools
              <IconArrowRight />
            </Button>
            <Button href="/blog" variant="secondary" size="lg">
              Read the blog
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Our mission
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
                Make everyday school tasks effortless.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-text-muted lg:col-span-7">
              <p>
                Calculating a GPA, comparing university admission requirements,
                building a fair attendance sheet, planning a seating chart — these
                are small tasks that quietly eat hours out of every week for
                students and teachers.
              </p>
              <p>
                We started {SITE_NAME} to fix that. Our goal is simple: ship
                fast, focused tools that you can open in one click, use
                immediately, and trust with your data. No accounts, no upsells,
                no learning curve.
              </p>
              <p>
                Every tool is designed around real classroom workflows{" "}
                <strong className="text-text">around the world</strong>
                {" "}— with sensible defaults, customizable grading scales, and
                terminology that works in any country.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-white p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              What we stand for
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              The principles behind every tool
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              We hold ourselves to a simple standard — if a tool isn’t faster
              than doing it by hand, we don’t ship it.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-text">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-surface-muted py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">
              What’s available
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Tools you can use right now
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              A handful of polished tools today — with more arriving every
              month.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="rounded-2xl border border-border bg-white p-6 shadow-sm"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-text">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {tool.description}
                  </p>
                  <div className="mt-4">
                    <Button href={tool.path} size="sm" variant="secondary">
                      Open tool
                      <IconArrowRight />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-white to-accent/5 p-8 text-center shadow-sm sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Got an idea for a tool?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
              We’re always listening. If there’s a tedious classroom task you’d
              love to automate, tell us — your suggestion might be the next
              tool we ship.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={`mailto:${CONTACT_EMAIL}`} size="lg">
                Email us
                <IconArrowRight />
              </Button>
              <Button href="/tools" variant="secondary" size="lg">
                Browse all tools
              </Button>
            </div>
            <p className="mt-6 text-sm text-text-muted">
              Or reach us directly at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary hover:text-primary-dark hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
