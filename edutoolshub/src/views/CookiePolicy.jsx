import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "../constants/site";

const EFFECTIVE_DATE = "August 2, 2026";

const sections = [
  { id: "what-are-cookies", label: "1. What Are Cookies?" },
  { id: "how-we-use", label: "2. How We Use Cookies" },
  { id: "types", label: "3. Types of Cookies We Use" },
  { id: "third-party", label: "4. Third-Party Cookies" },
  { id: "manage", label: "5. Managing Your Preferences" },
  { id: "updates", label: "6. Updates" },
  { id: "contact", label: "7. Contact" },
];

function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-xl font-bold tracking-tight text-text sm:text-2xl"
    >
      {children}
    </h2>
  );
}

function P({ children }) {
  return <p className="leading-relaxed text-text-muted">{children}</p>;
}

function UL({ children }) {
  return <ul className="list-disc space-y-2 pl-6 text-text-muted">{children}</ul>;
}

export default function CookiePolicy() {
  return (
    <div className="bg-surface-muted py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Legal</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            Effective date: {EFFECTIVE_DATE} · Last updated: {EFFECTIVE_DATE}
          </p>
          <p className="mt-4 leading-relaxed text-text-muted">
            This Cookie Policy explains how {SITE_NAME} ({SITE_URL}) uses cookies and similar
            technologies. It should be read together with our{" "}
            <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </header>

        <nav
          aria-label="Cookie policy sections"
          className="mb-10 rounded-2xl border border-border bg-white p-5 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-text">On this page</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-primary underline-offset-2 hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-10">
          <section className="space-y-3">
            <SectionHeading id="what-are-cookies">1. What Are Cookies?</SectionHeading>
            <P>
              Cookies are small text files stored on your device when you visit a website. Similar
              technologies include local storage and pixels. They help sites remember preferences,
              understand traffic, and (where permitted) show relevant advertising.
            </P>
          </section>

          <section className="space-y-3">
            <SectionHeading id="how-we-use">2. How We Use Cookies</SectionHeading>
            <P>We use cookies and similar technologies to:</P>
            <UL>
              <li>Keep essential site features working reliably</li>
              <li>Remember your cookie preference choice</li>
              <li>Measure how visitors use tools and content (analytics)</li>
              <li>
                Support advertising partners such as Google AdSense so we can keep free education
                tools available
              </li>
            </UL>
          </section>

          <section className="space-y-3">
            <SectionHeading id="types">3. Types of Cookies We Use</SectionHeading>
            <UL>
              <li>
                <strong className="text-text">Strictly necessary</strong> — required for basic
                navigation, security, and storing your consent choice. These do not require opt-in.
              </li>
              <li>
                <strong className="text-text">Analytics</strong> — help us understand which tools
                and pages are useful so we can improve them.
              </li>
              <li>
                <strong className="text-text">Advertising</strong> — used by Google and partners to
                deliver and measure ads. Personalized ads require consent where required by law.
              </li>
            </UL>
          </section>

          <section className="space-y-3">
            <SectionHeading id="third-party">4. Third-Party Cookies</SectionHeading>
            <P>
              Third parties may set cookies when their scripts run on our pages. This can include
              Google AdSense and analytics providers. Those parties process data under their own
              policies. You can learn more in Google’s advertising settings and our Privacy Policy.
            </P>
          </section>

          <section className="space-y-3">
            <SectionHeading id="manage">5. Managing Your Preferences</SectionHeading>
            <P>
              When you first visit, a cookie banner lets you accept optional cookies or continue
              with essential cookies only. You can also clear site data in your browser, or use
              browser controls to block cookies. Blocking some cookies may affect ads or analytics
              measurement but will not remove access to our free tools.
            </P>
            <P>
              You can opt out of personalized Google ads via{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                Google Ads Settings
              </a>{" "}
              and learn about industry opt-outs at{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                aboutads.info
              </a>
              .
            </P>
          </section>

          <section className="space-y-3">
            <SectionHeading id="updates">6. Updates</SectionHeading>
            <P>
              We may update this Cookie Policy when our practices or partners change. The effective
              date at the top of this page will be revised when we do.
            </P>
          </section>

          <section className="space-y-3">
            <SectionHeading id="contact">7. Contact</SectionHeading>
            <P>
              Questions about cookies or privacy? Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="font-medium text-primary underline-offset-2 hover:underline">
                Contact page
              </Link>
              .
            </P>
          </section>
        </div>
      </div>
    </div>
  );
}
