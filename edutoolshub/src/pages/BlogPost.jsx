import { useEffect, useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { PortableText } from "@portabletext/react";
import { format, parseISO } from "date-fns";
import { useSanityQuery } from "../sanity/useSanityQuery";
import { postBySlugQuery } from "../sanity/queries";
import { normalizePost, normalizePostSlug } from "../sanity/normalizeSlug";
import { urlFor } from "../sanity/image";
import { portableTextComponents } from "../sanity/portableTextComponents";
import { estimateReadingTime } from "../sanity/readingTime";
import Button from "../components/ui/Button";
import { IconArrowRight } from "../components/icons/ToolIcons";

const SITE_URL = "https://edutoolshub.com";
const SITE_NAME = "EduToolsHub";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMMM d, yyyy");
  } catch {
    return "";
  }
}

export default function BlogPost() {
  const navigate = useNavigate();
  const { slug: rawSlug } = useParams();
  const slug = normalizePostSlug(rawSlug);
  const { data: rawPost, error, isLoading } = useSanityQuery(postBySlugQuery, { slug });
  const post = useMemo(() => normalizePost(rawPost), [rawPost]);

  const canonicalSlug = post?.slug || slug;

  // Fix broken /blog/null URLs and sync the bar when Sanity slug differs from the path.
  useEffect(() => {
    if (!post || !canonicalSlug) return;
    if (rawSlug !== canonicalSlug) {
      navigate(`/blog/${canonicalSlug}`, { replace: true });
    }
  }, [post, canonicalSlug, rawSlug, navigate]);

  if (!slug || slug === "null") {
    return <Navigate to="/blog" replace />;
  }

  if (isLoading) return <PostSkeleton />;
  if (error) return <PostError error={error} />;
  if (!post) return <PostNotFound slug={slug} />;

  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.metaDescription || post.excerpt || "";
  const fullTitle = `${seoTitle} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}/blog/${canonicalSlug}`;

  const heroImageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1600).height(900).fit("crop").auto("format").url()
    : null;
  const heroImageSrcSet = post.mainImage
    ? [
        `${urlFor(post.mainImage).width(800).height(450).fit("crop").auto("format").url()} 800w`,
        `${urlFor(post.mainImage).width(1200).height(675).fit("crop").auto("format").url()} 1200w`,
        `${urlFor(post.mainImage).width(1600).height(900).fit("crop").auto("format").url()} 1600w`,
        `${urlFor(post.mainImage).width(2000).height(1125).fit("crop").auto("format").url()} 2000w`,
      ].join(", ")
    : undefined;
  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).fit("crop").auto("format").url()
    : null;
  const heroLqip = post.mainImage?.asset?.metadata?.lqip;

  const readingMinutes = estimateReadingTime(post.body);
  const formattedDate = formatDate(post.publishedAt);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: seoDescription,
    image: ogImage ? [ogImage] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        {ogImage && <meta property="og:image:width" content="1200" />}
        {ogImage && <meta property="og:image:height" content="630" />}
        {post.mainImage?.alt && (
          <meta property="og:image:alt" content={post.mainImage.alt} />
        )}
        {post.publishedAt && (
          <meta property="article:published_time" content={post.publishedAt} />
        )}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <article data-blog-status="ready">
        <PostHero
          title={post.title}
          excerpt={post.excerpt}
          publishedAt={post.publishedAt}
          formattedDate={formattedDate}
          readingMinutes={readingMinutes}
          heroImageUrl={heroImageUrl}
          heroImageSrcSet={heroImageSrcSet}
          heroImageAlt={post.mainImage?.alt || post.title}
          heroLqip={heroLqip}
          heroCaption={post.mainImage?.caption}
        />

        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="prose-anchor">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>

          <PostFooter />
        </div>
      </article>
    </>
  );
}

function PostHero({
  title,
  excerpt,
  publishedAt,
  formattedDate,
  readingMinutes,
  heroImageUrl,
  heroImageSrcSet,
  heroImageAlt,
  heroLqip,
  heroCaption,
}) {
  return (
    <header className="relative">
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-primary"
        >
          <span aria-hidden>←</span> Back to all articles
        </Link>

        <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {excerpt && (
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">
            {excerpt}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-text-muted">
          {publishedAt && (
            <time dateTime={publishedAt} className="font-medium">
              {formattedDate}
            </time>
          )}
          {publishedAt && <span aria-hidden>·</span>}
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
              alt={heroImageAlt}
              loading="eager"
              decoding="async"
              fetchpriority="high"
              className="block aspect-[16/9] h-auto w-full object-cover"
            />
          </div>
          {heroCaption && (
            <figcaption className="mt-3 text-center text-sm italic text-text-muted">
              {heroCaption}
            </figcaption>
          )}
        </figure>
      )}

      <div className="mt-10 sm:mt-14" />
    </header>
  );
}

function PostFooter() {
  return (
    <div className="my-16 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-white p-8 text-center sm:p-10">
      <h2 className="text-xl font-bold text-text sm:text-2xl">
        Found this useful?
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
        Try our free tools — calculate your GPA, check college GPA requirements,
        or generate an attendance sheet in seconds.
      </p>
      <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button to="/tools" size="md">
          Browse all tools
          <IconArrowRight />
        </Button>
        <Link
          to="/blog"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Read more articles
        </Link>
      </div>
    </div>
  );
}

function PostSkeleton() {
  return (
    <section className="py-12 sm:py-16" aria-hidden="true">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto h-3 w-32 animate-pulse rounded bg-surface-muted" />
        <div className="mx-auto mt-8 h-10 w-11/12 animate-pulse rounded bg-surface-muted" />
        <div className="mx-auto mt-3 h-10 w-3/4 animate-pulse rounded bg-surface-muted" />
        <div className="mx-auto mt-6 h-4 w-5/6 animate-pulse rounded bg-surface-muted" />
        <div className="mx-auto mt-2 h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
        <div className="mx-auto mt-5 h-3 w-48 animate-pulse rounded bg-surface-muted" />
      </div>
      <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-surface-muted" />
      </div>
      <div className="mx-auto mt-12 max-w-2xl space-y-4 px-4 sm:px-6 lg:px-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded bg-surface-muted ${
              i % 3 === 0 ? "w-11/12" : i % 3 === 1 ? "w-full" : "w-4/5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function PostNotFound({ slug }) {
  return (
    <>
      <Helmet>
        <title>Article not found | {SITE_NAME}</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <section className="py-24 sm:py-32" data-blog-status="not-found">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            404
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Article not found
          </h1>
          <p className="mt-4 text-base text-text-muted">
            We couldn't find an article at <code className="rounded bg-surface-muted px-1.5 py-0.5 text-sm">/blog/{slug}</code>.
            It may have been moved or unpublished.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/blog" size="md">
              Browse all articles
              <IconArrowRight />
            </Button>
            <Link to="/" className="text-sm font-semibold text-primary hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PostError({ error }) {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center"
        >
          <h1 className="text-base font-semibold text-red-900">
            Couldn't load this article
          </h1>
          <p className="mt-2 text-sm text-red-800/80">
            {error?.message || "Something went wrong while loading the article."}
          </p>
          <div className="mt-5">
            <Button to="/blog" variant="secondary" size="sm">
              ← Back to blog
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
