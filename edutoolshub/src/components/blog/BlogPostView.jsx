"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { format, parseISO } from "date-fns";
import { portableTextComponents } from "@/sanity/portableTextComponents";
import { estimateReadingTime } from "@/sanity/readingTime";
import Button from "@/components/ui/Button";
import { IconArrowRight } from "@/components/icons/ToolIcons";
import { trackBlogRead } from "@/utils/analytics";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMMM d, yyyy");
  } catch {
    return "";
  }
}

export default function BlogPostView({ post }) {
  const blogReadTracked = useRef(false);
  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.metaDescription || post.excerpt || "";
  const canonicalSlug = post.slug;

  const heroImageUrl = post._heroImage?.src ?? null;
  const heroImageSrcSet = post._heroImage?.srcSet;
  const heroLqip = post._heroImage?.lqip;
  const readingMinutes = estimateReadingTime(post.body);
  const formattedDate = formatDate(post.publishedAt);

  useEffect(() => {
    const handleScroll = () => {
      if (blogReadTracked.current) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) return;
      if (scrollTop / scrollHeight >= 0.8) {
        blogReadTracked.current = true;
        trackBlogRead(post.title, window.location.pathname);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post.title]);

  return (
    <article data-blog-status="ready">
      <header className="relative">
        <div className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
          >
            <span aria-hidden>←</span> Back to all articles
          </Link>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
              {post.excerpt}
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-text-muted">
            {post.publishedAt && (
              <time dateTime={post.publishedAt} className="font-medium">
                {formattedDate}
              </time>
            )}
            {post.publishedAt && <span aria-hidden>·</span>}
            <span>{readingMinutes} min read</span>
          </div>
        </div>
        {heroImageUrl && (
          <figure className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div
              className="overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-sm"
              style={
                heroLqip
                  ? { backgroundImage: `url(${heroLqip})`, backgroundSize: "cover" }
                  : undefined
              }
            >
              <img
                src={heroImageUrl}
                srcSet={heroImageSrcSet}
                sizes="(min-width: 1024px) 1024px, 100vw"
                alt={post._heroImage?.alt || post.title}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="block aspect-[16/9] h-auto w-full object-cover"
              />
            </div>
            {post._heroImage?.caption && (
              <figcaption className="mt-3 text-center text-sm italic text-text-muted">
                {post._heroImage.caption}
              </figcaption>
            )}
          </figure>
        )}
        <div className="mt-10 sm:mt-14" />
      </header>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="prose-anchor">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
        <div className="my-16 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-white p-8 text-center sm:p-10">
          <h2 className="text-xl font-bold text-text sm:text-2xl">Found this useful?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Try our free tools — calculate your GPA, check college GPA requirements, or generate
            an attendance sheet in seconds.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/tools" size="md">
              Browse all tools
              <IconArrowRight />
            </Button>
            <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
              ← Read more articles
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
