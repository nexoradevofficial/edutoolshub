"use client";

import { useEffect } from "react";
import Link from "next/link";
import ToolSeoSection from "@/components/tools/ToolSeoSection";
import ToolUsageGuide from "@/components/tools/ToolUsageGuide";
import ToolAudienceBadge from "@/components/tools/ToolAudienceBadge";
import { tools } from "@/data/tools";
import { toolQuickGuides } from "@/data/toolQuickGuides";
import { buildToolSchema } from "@/data/toolSeo";
import { trackToolUsed } from "@/utils/analytics";

const SITE_URL = "https://edutoolshub.com";

const MAX_WIDTH_CLASSES = {
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
  "3xl": "max-w-7xl",
};

export default function ToolPageLayout({
  title,
  description,
  children,
  maxWidth = "lg",
  toolName,
  toolCategory = "",
  seo,
}) {
  const widthClass = MAX_WIDTH_CLASSES[maxWidth] ?? MAX_WIDTH_CLASSES.lg;
  const toolMeta = seo?.id ? tools.find((t) => t.id === seo.id) : null;
  const quickGuide = seo?.quickGuide ?? (seo?.id ? toolQuickGuides[seo.id] : null);

  useEffect(() => {
    const name = toolName ?? title;
    if (name) trackToolUsed(name, toolCategory);
  }, [toolName, toolCategory, title]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-6 sm:py-12">
      <div className={`mx-auto ${widthClass} px-4 sm:px-6 lg:px-8`}>
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-sm font-medium text-text-muted transition-colors hover:text-primary print:hidden"
        >
          ← Back to tools
        </Link>

        <header className="mb-6 mt-4 print:hidden sm:mb-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{title}</h1>
            {toolMeta?.audience ? (
              <ToolAudienceBadge audience={toolMeta.audience} size="lg" />
            ) : null}
          </div>
          {description && (
            <p className="mt-2 text-sm text-text-muted sm:text-base">{description}</p>
          )}
        </header>

        {quickGuide ? (
          <ToolUsageGuide
            title={quickGuide.title}
            steps={quickGuide.steps}
            audience={toolMeta?.audience ?? "both"}
          />
        ) : null}

        {children}

        {seo && (
          <ToolSeoSection
            name={seo.name}
            howToUse={seo.howToUse}
            faqs={seo.faqs}
            relatedTools={seo.relatedTools}
          />
        )}
      </div>
    </div>
  );
}

export function buildToolMetadata(seo) {
  if (!seo) return {};
  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    alternates: { canonical: `${SITE_URL}${seo.path}` },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      url: `${SITE_URL}${seo.path}`,
    },
    other: {
      "script:ld+json": JSON.stringify(buildToolSchema(seo)),
    },
  };
}
