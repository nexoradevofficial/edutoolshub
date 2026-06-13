import { buildPageMetadata } from "@/lib/metadata";
import { enrichPostsForInsightSlide } from "@/lib/sanity-image";
import { getSanityServerClient } from "@/lib/sanity-server";
import { recentPostsQuery } from "@/sanity/queries";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { SITE_NAME, SITE_URL } from "@/constants/site";

const ToolsSection = dynamic(() => import("@/components/ToolsSection"));
const HowItWorks = dynamic(() => import("@/components/HowItWorks"));
const WhyUse = dynamic(() => import("@/components/WhyUse"));
const LatestInsights = dynamic(() => import("@/components/LatestInsights"));

const TITLE = "Free Education Tools for Students & Teachers | EduToolsHub";
const DESCRIPTION =
  "Free online education tools for students and teachers — GPA calculator, college GPA requirement checker, attendance sheet generator, lesson planner, fee receipt maker, and final grade calculator. No signup required.";
const KEYWORDS =
  "education tools, free tools for students, free tools for teachers, GPA calculator, GPA to percentage, college GPA requirement checker, minimum GPA for college, attendance sheet generator, student attendance tracker, lesson plan maker, lesson planner online, school fee receipt generator, fee receipt maker, final grade calculator, what grade do I need to pass, EduToolsHub";

export const metadata = {
  ...buildPageMetadata({ title: TITLE, description: DESCRIPTION, path: "/" }),
  keywords: KEYWORDS,
};

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

export default async function HomePage() {
  let recentPosts = [];
  try {
    const client = getSanityServerClient();
    const raw = await client.fetch(recentPostsQuery);
    recentPosts = enrichPostsForInsightSlide(raw);
  } catch {
    recentPosts = [];
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <Hero />
      <ToolsSection />
      <HowItWorks />
      <WhyUse />
      <LatestInsights initialPosts={recentPosts} />
    </>
  );
}
