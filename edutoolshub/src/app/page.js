import { buildPageMetadata } from "@/lib/metadata";
import { enrichPostsForInsightSlide } from "@/lib/sanity-image";
import { POSTS_TAG, sanityServerFetch } from "@/lib/sanity-server";
import { recentPostsQuery } from "@/sanity/queries";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import { SITE_NAME, SITE_URL, DEFAULT_LOGO_PATH } from "@/constants/site";

const ToolsSection = dynamic(() => import("@/components/ToolsSection"));
const SaasPromoSection = dynamic(() => import("@/components/SaasPromoSection"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const WhyUse = dynamic(() => import("@/components/WhyUse"));
const LatestInsights = dynamic(() => import("@/components/LatestInsights"));

const TITLE =
  "Free Education Tools & School Management SaaS | EduToolsHub";
const DESCRIPTION =
  "Free online tools for students and teachers — GPA calculator, attendance sheets, lesson planner — plus School & College Management System cloud SaaS for institutes. No signup for free tools.";
const KEYWORDS =
  "education tools, free tools for students, free tools for teachers, GPA calculator, school management system, college management system, school ERP Pakistan, education SaaS, institute management software, attendance sheet generator, lesson planner, EduToolsHub";

export const metadata = {
  ...buildPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/",
    keywords: KEYWORDS,
    ogImage: `${SITE_URL}/saas/school-college/dashboard-full.png`,
  }),
};

/** Fallback refresh cadence; a Sanity publish busts the cache instantly. */
export const revalidate = 300;

const websiteLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/tools?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${DEFAULT_LOGO_PATH}`,
      email: "nexoradevofficial@gmail.com",
      sameAs: ["https://nexora-dev-official.vercel.app/"],
      description: DESCRIPTION,
    },
    {
      "@type": "ItemList",
      name: "EduToolsHub products",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Free Education Tools",
          url: `${SITE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "SaaS Solutions Marketplace",
          url: `${SITE_URL}/saas`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "School & College Management System",
          url: `${SITE_URL}/saas/school-college-management-system`,
        },
      ],
    },
  ],
};

async function LatestInsightsSection() {
  let recentPosts = [];
  try {
    const raw = await sanityServerFetch(recentPostsQuery, {}, { tags: [POSTS_TAG] });
    recentPosts = enrichPostsForInsightSlide(raw);
  } catch {
    recentPosts = [];
  }

  return <LatestInsights initialPosts={recentPosts} />;
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <Hero />
      <ToolsSection />
      <SaasPromoSection variant="full" />
      <HowItWorks />
      <WhyUse />
      {/* Crawlable homepage SEO copy */}
      <section className="border-t border-border bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Free education tools and enterprise school software in one place
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">
            EduToolsHub helps students and teachers with free GPA calculators, college GPA
            requirement checkers, attendance sheets, lesson planners, and more — no signup
            required. Institutes that need full automation can upgrade to our{" "}
            <a
              href="/saas/school-college-management-system"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              School &amp; College Management System
            </a>
            , a cloud SaaS ERP for admissions, fees, QR attendance, WhatsApp messaging, exams,
            and Admin/Teacher portals. Explore the{" "}
            <a href="/saas" className="font-medium text-primary underline-offset-2 hover:underline">
              SaaS marketplace
            </a>{" "}
            for enterprise solutions built by Nexora Dev.
          </p>
        </div>
      </section>
      <Suspense fallback={null}>
        <LatestInsightsSection />
      </Suspense>
    </>
  );
}
