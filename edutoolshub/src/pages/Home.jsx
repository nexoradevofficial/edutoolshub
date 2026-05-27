import { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import ToolsSection from "../components/ToolsSection";
import HowItWorks from "../components/HowItWorks";
import WhyUse from "../components/WhyUse";

const LatestInsights = lazy(() => import("../components/LatestInsights"));

export default function Home() {
  return (
    <>
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
