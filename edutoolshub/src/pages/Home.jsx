import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../components/Hero";
import ToolsSection from "../components/ToolsSection";
import HowItWorks from "../components/HowItWorks";
import WhyUse from "../components/WhyUse";

const LatestInsights = lazy(() => import("../components/LatestInsights"));

const SITE_URL = "https://edutoolshub.com";
const SITE_NAME = "EduToolsHub";
const TITLE = "Free Education Tools for Students & Teachers | EduToolsHub";
const DESCRIPTION =
  "Free online education tools for students and teachers — GPA calculator, college GPA requirement checker, attendance sheet generator, lesson planner, fee receipt maker, and final grade calculator. No signup required.";
const KEYWORDS =
  "education tools, free tools for students, free tools for teachers, GPA calculator, GPA to percentage, college GPA requirement checker, minimum GPA for college, attendance sheet generator, student attendance tracker, lesson plan maker, lesson planner online, school fee receipt generator, fee receipt maker, final grade calculator, what grade do I need to pass, EduToolsHub";

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="keywords" content={KEYWORDS} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/logo.png`} />
        <meta name="robots" content="index,follow" />
        <script type="application/ld+json">{JSON.stringify(websiteLd)}</script>
      </Helmet>

      <Hero />
      <ToolsSection />
      <HowItWorks />
      <WhyUse />
      <Suspense fallback={<InsightsSectionPlaceholder />}>
        <LatestInsights />
      </Suspense>
    </>
  );
}

function InsightsSectionPlaceholder() {
  return (
    <section
      className="bg-white py-20 sm:py-24"
      aria-hidden="true"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface-muted" />
        <div className="mt-10 -ml-4 flex sm:-ml-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-[46%] sm:pl-5 lg:basis-[33.333%]"
            >
              <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-surface-muted" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
