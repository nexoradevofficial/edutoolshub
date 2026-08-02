import { buildPageMetadata } from "@/lib/metadata";
import { enrichPostsForInsightSlide } from "@/lib/sanity-image";
import { POSTS_TAG, sanityServerFetch } from "@/lib/sanity-server";
import { recentPostsQuery } from "@/sanity/queries";
import { applyBlogRewriteList } from "@/content/blogRewrites";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Hero from "@/components/Hero";
import { SITE_NAME, SITE_URL, DEFAULT_LOGO_PATH } from "@/constants/site";

const ToolsSection = dynamic(() => import("@/components/ToolsSection"));
const SaasPromoSection = dynamic(() => import("@/components/SaasPromoSection"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const WhyUse = dynamic(() => import("@/components/WhyUse"));
const LatestInsights = dynamic(() => import("@/components/LatestInsights"));
const HomeEducationalContent = dynamic(() => import("@/components/HomeEducationalContent"));

const TITLE =
  "Free Education Tools & School Management SaaS | EduToolsHub";
const DESCRIPTION =
  "Free online tools for students and teachers — GPA calculator, attendance sheets, lesson planner — plus School & College Management System cloud SaaS for institutes. No signup for free tools.";
const KEYWORDS =
  "education tools, GPA calculator, attendance sheet, lesson planner, school management system, EduToolsHub";

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
    recentPosts = enrichPostsForInsightSlide(applyBlogRewriteList(raw));
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
      <HomeEducationalContent />
      <Suspense fallback={null}>
        <LatestInsightsSection />
      </Suspense>
    </>
  );
}
