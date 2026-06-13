import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "../constants/site";

const EFFECTIVE_DATE = "June 13, 2026";

const sections = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "acceptable-use", label: "2. Acceptable Use" },
  { id: "intellectual-property", label: "3. Intellectual Property" },
  { id: "no-warranties", label: "4. No Warranties" },
  { id: "limitation-of-liability", label: "5. Limitation of Liability" },
  { id: "third-party", label: "6. Third-Party Links & Services" },
  { id: "changes", label: "7. Changes to These Terms" },
  { id: "governing-law", label: "8. Governing Law" },
  { id: "contact", label: "9. Contact" },
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

export default function TermsOfService() {
  const canonical = `${SITE_URL}/terms`;
  const title = `Terms of Service — ${SITE_NAME}`;
  const description =
    "Read the EduToolsHub Terms of Service. Learn about acceptable use, intellectual property, disclaimers, limitation of liability, and governing law.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <div className="bg-surface-muted py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <header className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Legal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Effective date: {EFFECTIVE_DATE}
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of{" "}
              {SITE_NAME} at{" "}
              <a href={SITE_URL} className="text-primary hover:underline">
                edutoolshub.com
              </a>
              . By using the site, you agree to these Terms. If you do not agree, please do
              not use the service.
            </p>
          </header>

          <nav
            aria-label="Table of contents"
            className="mb-10 rounded-2xl border border-border bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-text">On this page</p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-primary hover:underline">
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="space-y-10 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-10">
            <section className="space-y-4">
              <SectionHeading id="acceptance">1. Acceptance of Terms</SectionHeading>
              <P>
                These Terms form a binding agreement between you and {SITE_NAME} regarding
                your use of our website, tools, blog, and related services. Your continued
                use of the site after we post updates constitutes acceptance of the revised
                Terms.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="acceptable-use">2. Acceptable Use</SectionHeading>
              <P>You agree to use {SITE_NAME} only for lawful purposes. You must not:</P>
              <UL>
                <li>
                  Use the site in any way that violates applicable local, national, or
                  international law or regulation.
                </li>
                <li>
                  Attempt to gain unauthorized access to our systems, APIs, or data, or
                  interfere with the proper working of the site.
                </li>
                <li>
                  Scrape, crawl, or harvest content or data at a rate or volume that
                  unreasonably burdens our infrastructure, except as permitted by search
                  engines and standard indexing.
                </li>
                <li>
                  Upload, transmit, or distribute malware, spam, or harmful code through
                  any contact or feedback channel.
                </li>
                <li>
                  Misrepresent your affiliation with {SITE_NAME} or use our brand, logo, or
                  content in a way that implies endorsement without permission.
                </li>
                <li>
                  Use our tools or content to harass, defame, or harm others, or to generate
                  misleading academic or official documents presented as authentic
                  institutional records.
                </li>
              </UL>
              <P>
                We may suspend or restrict access if we reasonably believe you have violated
                these rules.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="intellectual-property">
                3. Intellectual Property
              </SectionHeading>
              <P>
                The {SITE_NAME} name, logo, website design, software, blog articles,
                documentation, and other materials are owned by {SITE_NAME} and its
                licensors and are protected by copyright, trademark, and other intellectual
                property laws.
              </P>
              <P>
                We grant you a limited, non-exclusive, non-transferable, revocable license
                to access and use the site for personal, educational, and non-commercial
                purposes. You may not copy, modify, distribute, sell, sublicense, or create
                derivative works from our content or code except where expressly allowed by
                law or with our prior written consent.
              </P>
              <P>
                Tool outputs you generate (for example, GPA calculations, attendance sheets,
                or receipts) are yours to use for your own educational or administrative
                purposes, subject to any third-party rights in data you provide.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="no-warranties">4. No Warranties</SectionHeading>
              <P>
                {SITE_NAME} is provided on an &ldquo;as is&rdquo; and &ldquo;as
                available&rdquo; basis. To the fullest extent permitted by law, we disclaim
                all warranties, whether express, implied, or statutory, including implied
                warranties of merchantability, fitness for a particular purpose, title, and
                non-infringement.
              </P>
              <P>
                We do not warrant that the site will be uninterrupted, error-free, secure,
                or free of viruses; that tool results will be accurate for every grading
                system or institution; or that blog content will always reflect the latest
                admissions or academic policies. You use the tools and information at your
                own discretion and should verify important decisions with official sources.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="limitation-of-liability">
                5. Limitation of Liability
              </SectionHeading>
              <P>
                To the maximum extent permitted by applicable law, {SITE_NAME} and its
                operators, affiliates, and contributors will not be liable for any indirect,
                incidental, special, consequential, or punitive damages, or for any loss of
                profits, data, goodwill, or other intangible losses, arising out of or
                related to your use of or inability to use the site.
              </P>
              <P>
                Our total liability for any claim arising from these Terms or your use of
                the site will not exceed the greater of (a) the amount you paid us, if any,
                in the twelve months before the claim, or (b) one hundred U.S. dollars
                (USD $100).
              </P>
              <P>
                Some jurisdictions do not allow certain limitations of liability; in those
                cases, our liability is limited to the minimum extent permitted by law.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="third-party">6. Third-Party Links & Services</SectionHeading>
              <P>
                The site may link to third-party websites, services, or content (including
                university pages, analytics, or advertising partners). We do not control and
                are not responsible for third-party sites or services. Your use of them is
                governed by their own terms and policies.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="changes">7. Changes to These Terms</SectionHeading>
              <P>
                We may update these Terms from time to time. When we do, we will revise the
                effective date at the top of this page. Material changes may also be noted
                on the site. Please review this page periodically.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="governing-law">8. Governing Law</SectionHeading>
              <P>
                These Terms are governed by and construed in accordance with the laws of the
                State of Delaware, United States, without regard to its conflict-of-law
                principles. Any dispute arising from these Terms or the site will be brought
                exclusively in the state or federal courts located in Delaware, and you
                consent to personal jurisdiction in those courts.
              </P>
              <P>
                If you access the site from outside the United States, you are responsible
                for compliance with local laws where applicable.
              </P>
            </section>

            <section className="space-y-4">
              <SectionHeading id="contact">9. Contact</SectionHeading>
              <P>
                Questions about these Terms? Contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-primary hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                or visit our{" "}
                <Link to="/contact" className="font-medium text-primary hover:underline">
                  contact page
                </Link>
                .
              </P>
            </section>
          </article>

          <p className="mt-8 text-center text-sm text-text-muted">
            See also our{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
