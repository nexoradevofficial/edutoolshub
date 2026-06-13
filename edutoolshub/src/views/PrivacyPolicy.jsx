import Link from "next/link";

import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "../constants/site";
const EFFECTIVE_DATE = "May 26, 2026";

const sections = [
  { id: "introduction", label: "1. Introduction" },
  { id: "information-we-collect", label: "2. Information We Collect" },
  { id: "how-we-use", label: "3. How We Use Your Information" },
  { id: "legal-basis", label: "4. Legal Basis for Processing (GDPR)" },
  { id: "cookies", label: "5. Cookies & Similar Technologies" },
  { id: "advertising", label: "6. Advertising & Google AdSense" },
  { id: "analytics", label: "7. Analytics" },
  { id: "third-parties", label: "8. Third-Party Services" },
  { id: "sharing", label: "9. How We Share Information" },
  { id: "retention", label: "10. Data Retention" },
  { id: "your-rights", label: "11. Your Rights & Choices" },
  { id: "ccpa", label: "12. California Privacy Rights (CCPA / CPRA)" },
  { id: "children", label: "13. Children’s Privacy" },
  { id: "international", label: "14. International Data Transfers" },
  { id: "security", label: "15. Security" },
  { id: "third-party-links", label: "16. Links to Other Websites" },
  { id: "changes", label: "17. Changes to This Policy" },
  { id: "contact", label: "18. Contact Us" },
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
  return (
    <ul className="list-disc space-y-2 pl-6 text-text-muted">{children}</ul>
  );
}

export default function PrivacyPolicy() {
  const canonical = `${SITE_URL}/privacy`;
  const title = `Privacy Policy — ${SITE_NAME}`;
  const description =
    "Read the EduToolsHub Privacy Policy. Learn what data we collect, how we use cookies, our advertising and analytics partners, and your rights under GDPR and CCPA.";

  return (
    <div className="bg-surface-muted py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Legal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Effective date: <time dateTime="2026-05-26">{EFFECTIVE_DATE}</time>
              {" · "}Last updated: <time dateTime="2026-05-26">{EFFECTIVE_DATE}</time>
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              This Privacy Policy describes how {SITE_NAME} (“we”, “us”, or
              “our”) collects, uses, shares, and protects information when you
              visit{" "}
              <a
                href={SITE_URL}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                edutoolshub.com
              </a>{" "}
              or use any of our online tools (collectively, the “Service”). By
              using the Service you agree to the practices described below.
            </p>
          </header>

          <nav
            aria-label="On this page"
            className="mb-10 rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              On this page
            </p>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-primary transition-colors hover:text-primary-dark hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="space-y-10 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-10">
            <section className="space-y-3">
              <SectionHeading id="introduction">1. Introduction</SectionHeading>
              <P>
                {SITE_NAME} provides free, browser-based education tools — such
                as a GPA calculator, college GPA requirement checker, attendance
                sheet generator, timetable
                builder, and related utilities — for students, teachers, and
                schools worldwide. We are committed to handling your
                information transparently and only collecting what is necessary
                to operate, improve, and secure the Service.
              </P>
              <P>
                Most calculations performed by our tools (for example, the GPA
                calculator) run entirely in your browser. We do not require an
                account, and we do not transmit the academic data you enter to
                our servers unless explicitly indicated within a specific tool.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="information-we-collect">
                2. Information We Collect
              </SectionHeading>
              <P>
                We collect information in three ways: information you provide
                directly, information collected automatically, and information
                provided by third parties.
              </P>

              <h3 className="mt-4 text-base font-semibold text-text">
                a) Information you provide
              </h3>
              <UL>
                <li>
                  <strong>Tool inputs.</strong> Course names, grades, credits,
                  student names, institution names, and similar data that you
                  enter into our tools. This information is processed in your
                  browser and is not sent to our servers unless a tool clearly
                  states otherwise.
                </li>
                <li>
                  <strong>Communications.</strong> If you contact us by email,
                  we receive your email address, name (if provided), and the
                  contents of your message.
                </li>
              </UL>

              <h3 className="mt-4 text-base font-semibold text-text">
                b) Information collected automatically
              </h3>
              <UL>
                <li>
                  <strong>Device & connection data:</strong> IP address (often
                  truncated for analytics), browser type and version, operating
                  system, device type, screen size, language, and time zone.
                </li>
                <li>
                  <strong>Usage data:</strong> pages visited, referring URLs,
                  navigation paths, approximate time spent on a page, clicks,
                  and similar interaction data.
                </li>
                <li>
                  <strong>Cookies and similar technologies:</strong> see the
                  “Cookies & Similar Technologies” section below.
                </li>
              </UL>

              <h3 className="mt-4 text-base font-semibold text-text">
                c) Information from third parties
              </h3>
              <UL>
                <li>
                  Aggregated or pseudonymous reports from analytics and
                  advertising partners (e.g., Google) about traffic, audience
                  demographics, and ad performance.
                </li>
              </UL>
            </section>

            <section className="space-y-3">
              <SectionHeading id="how-we-use">
                3. How We Use Your Information
              </SectionHeading>
              <P>We use information to:</P>
              <UL>
                <li>Operate, maintain, and improve the Service and our tools.</li>
                <li>
                  Understand how visitors find and use the site so we can build
                  better tools and content.
                </li>
                <li>
                  Display advertisements that help us keep the Service free
                  (see the Advertising section).
                </li>
                <li>
                  Detect, prevent, and address security incidents, fraud, and
                  abuse.
                </li>
                <li>Respond to your inquiries and support requests.</li>
                <li>
                  Comply with legal obligations and enforce our terms of use.
                </li>
              </UL>
            </section>

            <section className="space-y-3">
              <SectionHeading id="legal-basis">
                4. Legal Basis for Processing (GDPR)
              </SectionHeading>
              <P>
                If you are located in the European Economic Area (EEA), the
                United Kingdom, or Switzerland, our legal bases for processing
                personal data include:
              </P>
              <UL>
                <li>
                  <strong>Legitimate interests</strong> — to operate, secure,
                  and improve the Service.
                </li>
                <li>
                  <strong>Consent</strong> — for non-essential cookies,
                  personalised advertising, and analytics, where consent is
                  required by law. You can withdraw consent at any time.
                </li>
                <li>
                  <strong>Legal obligation</strong> — to comply with applicable
                  laws and respond to lawful requests.
                </li>
              </UL>
            </section>

            <section className="space-y-3">
              <SectionHeading id="cookies">
                5. Cookies & Similar Technologies
              </SectionHeading>
              <P>
                A cookie is a small text file stored on your device. We and our
                partners use cookies, local storage, and similar technologies
                to make the Service work, remember your preferences, measure
                usage, and (where permitted) deliver advertising.
              </P>
              <UL>
                <li>
                  <strong>Strictly necessary cookies</strong> — required for
                  core functionality such as security, load balancing, and
                  remembering UI preferences.
                </li>
                <li>
                  <strong>Analytics cookies</strong> — help us understand
                  aggregated usage so we can improve the Service.
                </li>
                <li>
                  <strong>Advertising cookies</strong> — used by Google and
                  other partners to display relevant ads and measure their
                  performance, where permitted by law and your choices.
                </li>
              </UL>
              <P>
                You can control cookies through your browser settings (for
                example, blocking or deleting cookies) and through any cookie
                banner or consent tool we provide. Blocking some cookies may
                affect how the Service works.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="advertising">
                6. Advertising & Google AdSense
              </SectionHeading>
              <P>
                We may use third-party advertising partners, including Google,
                to display ads on the Service. Such advertising helps us keep
                the tools free for everyone.
              </P>
              <UL>
                <li>
                  Google, as a third-party vendor, uses cookies (including the{" "}
                  <em>DART</em> cookie) to serve ads based on your prior visits
                  to this and other websites.
                </li>
                <li>
                  Google’s use of advertising cookies enables it and its
                  partners to serve ads to you based on your visits to this
                  site and/or other sites on the Internet.
                </li>
                <li>
                  You may opt out of personalised advertising by visiting{" "}
                  <a
                    href="https://www.google.com/settings/ads"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Ads Settings
                  </a>
                  .
                </li>
                <li>
                  You can also opt out of third-party vendors’ use of cookies
                  for personalised advertising by visiting{" "}
                  <a
                    href="https://www.aboutads.info/choices/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    aboutads.info/choices
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://www.youronlinechoices.com/"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    youronlinechoices.com
                  </a>
                  .
                </li>
                <li>
                  For users in the EEA, UK, and Switzerland we and our partners
                  rely on Google’s consent management to obtain your consent
                  for advertising cookies in line with the GDPR and ePrivacy
                  rules.
                </li>
              </UL>
              <P>
                For more information about how Google uses data, see Google’s
                privacy and terms page at{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  policies.google.com/technologies/partner-sites
                </a>
                .
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="analytics">7. Analytics</SectionHeading>
              <P>
                We may use analytics services such as Google Analytics to
                understand how users engage with the Service. These services
                may use cookies and other identifiers to collect information
                about your use of the Service and combine it with other data
                they have. The data is generally aggregated and pseudonymous.
              </P>
              <P>
                You can opt out of Google Analytics by installing the{" "}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
                .
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="third-parties">
                8. Third-Party Services
              </SectionHeading>
              <P>
                We rely on a small number of trusted third-party providers to
                run the Service. These may include:
              </P>
              <UL>
                <li>
                  <strong>Hosting & content delivery</strong> — to serve our
                  pages quickly and reliably worldwide.
                </li>
                <li>
                  <strong>Analytics</strong> (e.g., Google Analytics) — to
                  understand aggregated usage.
                </li>
                <li>
                  <strong>Advertising</strong> (e.g., Google AdSense) — to
                  display ads that help fund the Service.
                </li>
                <li>
                  <strong>Content management</strong> — to publish blog posts
                  and educational articles.
                </li>
                <li>
                  <strong>Email</strong> — to receive and reply to messages
                  sent to our contact address.
                </li>
              </UL>
              <P>
                Each of these providers is bound by their own privacy
                obligations and processes data only as needed to provide their
                service to us.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="sharing">
                9. How We Share Information
              </SectionHeading>
              <P>We do not sell your personal information. We may share data:</P>
              <UL>
                <li>
                  With <strong>service providers</strong> listed above, only as
                  needed to operate the Service.
                </li>
                <li>
                  With <strong>law enforcement or other authorities</strong>{" "}
                  when required by law, subpoena, or to protect rights, safety,
                  and property.
                </li>
                <li>
                  In connection with a <strong>business transfer</strong> such
                  as a merger or acquisition, in which case we will notify you
                  before your information becomes subject to a different
                  privacy policy.
                </li>
                <li>
                  With your <strong>consent</strong> or at your direction.
                </li>
              </UL>
            </section>

            <section className="space-y-3">
              <SectionHeading id="retention">10. Data Retention</SectionHeading>
              <P>
                We keep personal data only for as long as is necessary for the
                purposes described in this policy, to comply with our legal
                obligations, resolve disputes, and enforce our agreements.
                Aggregated and de-identified data may be retained for longer
                periods.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="your-rights">
                11. Your Rights & Choices
              </SectionHeading>
              <P>
                Depending on where you live, you may have the following rights
                regarding your personal data:
              </P>
              <UL>
                <li>Access a copy of the personal data we hold about you.</li>
                <li>
                  Request correction of inaccurate or incomplete information.
                </li>
                <li>Request deletion of your personal data.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Request data portability where applicable.</li>
                <li>
                  Withdraw consent at any time where we rely on consent.
                </li>
                <li>
                  Lodge a complaint with your local data protection authority.
                </li>
              </UL>
              <P>
                To exercise any of these rights, please email us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                . We may need to verify your identity before responding.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="ccpa">
                12. California Privacy Rights (CCPA / CPRA)
              </SectionHeading>
              <P>
                If you are a California resident, the California Consumer
                Privacy Act, as amended by the California Privacy Rights Act
                (collectively, “CCPA”), provides you with specific rights:
              </P>
              <UL>
                <li>
                  The right to <strong>know</strong> what personal information
                  we have collected, used, disclosed, and shared.
                </li>
                <li>
                  The right to <strong>delete</strong> personal information we
                  have collected, subject to certain exceptions.
                </li>
                <li>
                  The right to <strong>correct</strong> inaccurate personal
                  information.
                </li>
                <li>
                  The right to <strong>opt out</strong> of the “sale” or
                  “sharing” of personal information, including for cross-context
                  behavioural advertising.
                </li>
                <li>
                  The right to <strong>non-discrimination</strong> for
                  exercising these rights.
                </li>
              </UL>
              <P>
                We do not sell personal information for money. To exercise any
                of the rights above, contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="children">
                13. Children’s Privacy
              </SectionHeading>
              <P>
                The Service is intended for a general audience, including
                students. We do not knowingly collect personal information
                from children under the age of 13 (or under 16 in the EEA / UK)
                without verifiable parental consent. If you believe a child has
                provided us with personal information, please contact us so we
                can delete it.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="international">
                14. International Data Transfers
              </SectionHeading>
              <P>
                We operate globally, and our service providers may process your
                data in countries other than your own, including the United
                States. Where required by law, we rely on appropriate
                safeguards (such as the European Commission’s Standard
                Contractual Clauses) to protect international transfers of
                personal data.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="security">15. Security</SectionHeading>
              <P>
                We use industry-standard technical and organisational measures
                — including HTTPS, restricted access, and secure
                infrastructure — to protect personal information. However, no
                method of transmission or storage is 100% secure, and we
                cannot guarantee absolute security.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="third-party-links">
                16. Links to Other Websites
              </SectionHeading>
              <P>
                The Service may contain links to third-party websites that we
                do not own or control. This Privacy Policy does not apply to
                those sites; we encourage you to review the privacy policies
                of any third-party site you visit.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="changes">
                17. Changes to This Policy
              </SectionHeading>
              <P>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices or for legal, operational, or
                regulatory reasons. When we make material changes, we will
                update the “Last updated” date at the top of this page and, if
                appropriate, provide additional notice. Your continued use of
                the Service after an update constitutes acceptance of the
                revised policy.
              </P>
            </section>

            <section className="space-y-3">
              <SectionHeading id="contact">18. Contact Us</SectionHeading>
              <P>
                If you have any questions, requests, or complaints about this
                Privacy Policy or our handling of your personal data, please
                contact us:
              </P>
              <div className="rounded-xl border border-border bg-surface-muted p-5 text-sm text-text">
                <p>
                  <strong>{SITE_NAME}</strong>
                </p>
                <p className="mt-1">
                  Email:{" "}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-primary hover:underline"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p className="mt-1">
                  Website:{" "}
                  <a
                    href={SITE_URL}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    edutoolshub.com
                  </a>
                </p>
              </div>
            </section>
          </article>

          <p className="mt-8 text-center text-sm text-text-muted">
            See our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            or head back to the{" "}
            <Link href="/" className="text-primary hover:underline">
              homepage
            </Link>
            .
          </p>
        </div>
      </div>
  );
}
