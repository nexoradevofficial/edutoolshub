import { toHTML } from "@portabletext/to-html";
import { normalizePost, normalizePosts, normalizePostSlug } from "../../src/sanity/normalizeSlug.js";
import { escapeHtml } from "./html-escape.js";
import { buildImageUrl } from "./sanity-image-server.js";
import { SITE_URL } from "./ssr-shell.js";

const SITE_NAME = "EduToolsHub";

const BLOG_LIST_TITLE = "Blog — Guides for Students & Teachers | EduToolsHub";
const BLOG_LIST_DESCRIPTION =
  "Free expert guides on GPA calculations, attendance tracking, exam prep, and university admissions for students and teachers worldwide.";

function formatDateLong(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function formatDateShort(iso) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function estimateReadingTime(body) {
  if (!Array.isArray(body)) return 1;
  let wordCount = 0;
  for (const block of body) {
    if (block?._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child?.text === "string") {
          wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }
  return Math.max(1, Math.round(wordCount / 225));
}

const portableTextHtmlComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return "";
      const src = buildImageUrl(value, { width: 1200, fit: "max" });
      const alt = escapeHtml(value.alt || "");
      const caption = value.caption
        ? `<figcaption class="mt-3 text-center text-sm italic text-text-muted">${escapeHtml(value.caption)}</figcaption>`
        : "";
      return `<figure class="my-8 sm:my-10">
        <div class="overflow-hidden rounded-2xl border border-border bg-surface-muted">
          <img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" decoding="async" class="block h-auto w-full" />
        </div>
        ${caption}
      </figure>`;
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal =
        /^https?:\/\//i.test(href) && !href.includes("edutoolshub.com");
      const target = value?.openInNewTab || isExternal ? ' target="_blank"' : "";
      const rel = target ? ' rel="noopener noreferrer"' : "";
      return `<a href="${escapeHtml(href)}"${target}${rel} class="font-medium text-primary underline decoration-primary/40 underline-offset-2">${children}</a>`;
    },
    strong: ({ children }) => `<strong class="font-semibold text-text">${children}</strong>`,
    em: ({ children }) => `<em class="italic">${children}</em>`,
    code: ({ children }) =>
      `<code class="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em] text-text border border-border">${children}</code>`,
  },
  block: {
    h1: ({ children }) =>
      `<h1 class="scroll-mt-24 text-3xl font-bold tracking-tight text-text sm:text-4xl mt-12 mb-4 first:mt-0">${children}</h1>`,
    h2: ({ children }) =>
      `<h2 class="scroll-mt-24 text-2xl font-bold tracking-tight text-text sm:text-3xl mt-12 mb-3 first:mt-0">${children}</h2>`,
    h3: ({ children }) =>
      `<h3 class="scroll-mt-24 text-xl font-semibold tracking-tight text-text sm:text-2xl mt-10 mb-2 first:mt-0">${children}</h3>`,
    h4: ({ children }) =>
      `<h4 class="text-lg font-semibold text-text mt-8 mb-2 first:mt-0">${children}</h4>`,
    blockquote: ({ children }) =>
      `<blockquote class="my-7 border-l-4 border-primary bg-primary/5 px-5 py-4 rounded-r-lg italic text-text"><div class="text-base leading-relaxed sm:text-lg">${children}</div></blockquote>`,
    normal: ({ children }) =>
      `<p class="my-5 text-base leading-7 text-text sm:leading-8 sm:text-[1.0625rem]">${children}</p>`,
  },
  list: {
    bullet: ({ children }) =>
      `<ul class="my-5 ml-1 list-outside space-y-2 pl-5 text-base leading-7 text-text marker:text-primary sm:text-[1.0625rem]">${children}</ul>`,
    number: ({ children }) =>
      `<ol class="my-5 ml-1 list-outside space-y-2 pl-5 text-base leading-7 text-text marker:font-semibold marker:text-primary sm:text-[1.0625rem]">${children}</ol>`,
  },
  listItem: {
    bullet: ({ children }) => `<li class="pl-1 list-disc">${children}</li>`,
    number: ({ children }) => `<li class="pl-1 list-decimal">${children}</li>`,
  },
};

function renderPortableText(body) {
  if (!Array.isArray(body) || body.length === 0) return "";
  return toHTML(body, { components: portableTextHtmlComponents });
}

function renderBlogCard(post, priority = false) {
  const href = `/blog/${escapeHtml(post.slug)}`;
  const imageSrc = post.mainImage
    ? buildImageUrl(post.mainImage, { width: 800, height: 500, fit: "crop" })
    : "";
  const alt = escapeHtml(post.mainImage?.alt || post.title || "Blog post cover image");
  const loading = priority ? "eager" : "lazy";

  const imageHtml = imageSrc
    ? `<img src="${escapeHtml(imageSrc)}" alt="${alt}" loading="${loading}" decoding="async" class="h-full w-full object-cover" />`
    : `<div class="flex h-full w-full items-center justify-center text-text-muted"><span class="text-xs uppercase tracking-wider">No image</span></div>`;

  const dateHtml = post.publishedAt
    ? `<time datetime="${escapeHtml(post.publishedAt)}" class="text-xs font-medium uppercase tracking-wider text-text-muted">${escapeHtml(formatDateShort(post.publishedAt))}</time>`
    : "";

  const excerptHtml = post.excerpt
    ? `<p class="line-clamp-3 flex-1 text-sm leading-relaxed text-text-muted">${escapeHtml(post.excerpt)}</p>`
    : "";

  return `<article class="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
    <a href="${href}" class="flex flex-1 flex-col">
    <div class="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">${imageHtml}</div>
    <div class="flex flex-1 flex-col gap-3 p-6">
      ${dateHtml}
      <h2 class="text-xl font-semibold leading-snug tracking-tight text-text">${escapeHtml(post.title)}</h2>
      ${excerptHtml}
      <span class="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Read article →</span>
    </div>
    </a>
  </article>`;
}

function renderCtaBlock() {
  return `<div class="mt-16 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-white p-8 text-center sm:p-10">
    <h2 class="text-xl font-bold text-text sm:text-2xl">While you read, try our tools</h2>
    <p class="mx-auto mt-2 max-w-md text-sm text-text-muted">Calculate your GPA, check university requirements, or generate an attendance sheet — instantly, free, no signup.</p>
    <div class="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a href="/tools" class="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Browse all tools</a>
      <a href="/tools/college-university-gpa-requirement-checker" class="text-sm font-semibold text-primary">Or try College / University GPA Requirement Checker →</a>
    </div>
  </div>`;
}

/** @param {object[]} rawPosts */
export function buildBlogListPage(rawPosts) {
  const posts = (normalizePosts(rawPosts) || []).filter((post) =>
    normalizePostSlug(post?.slug)
  );
  const cardsHtml = posts.map((post, i) => renderBlogCard(post, i < 3)).join("");

  const rootHtml = `<div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <section class="py-16 sm:py-20" data-blog-list-status="ready">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header class="mx-auto max-w-2xl text-center">
            <p class="text-sm font-semibold uppercase tracking-wider text-primary">Blog</p>
            <h1 class="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">Practical guides for students &amp; teachers</h1>
            <p class="mt-4 text-lg text-text-muted">Honest, actionable articles on GPA, grades, attendance, exam prep, and college admissions.</p>
          </header>
          <div class="mt-12">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${cardsHtml}</div>
          </div>
          ${renderCtaBlock()}
        </div>
      </section>
    </main>
  </div>`;

  const headHtml = [
    `<meta name="description" content="${escapeHtml(BLOG_LIST_DESCRIPTION)}" />`,
    `<link rel="canonical" href="${SITE_URL}/blog" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(BLOG_LIST_TITLE)}" />`,
    `<meta property="og:description" content="${escapeHtml(BLOG_LIST_DESCRIPTION)}" />`,
    `<meta property="og:url" content="${SITE_URL}/blog" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(BLOG_LIST_TITLE)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(BLOG_LIST_DESCRIPTION)}" />`,
  ].join("\n");

  return {
    title: BLOG_LIST_TITLE,
    headHtml,
    rootHtml,
    ssrBootstrap: { scope: "all", data: rawPosts },
  };
}

/** @param {object|null} rawPost */
export function buildBlogPostPage(rawPost) {
  const post = normalizePost(rawPost);
  if (!post) return null;

  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.metaDescription || post.excerpt || "";
  const fullTitle = `${seoTitle} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const heroImageUrl = post.mainImage
    ? buildImageUrl(post.mainImage, { width: 1600, height: 900, fit: "crop" })
    : "";
  const ogImage = post.mainImage
    ? buildImageUrl(post.mainImage, { width: 1200, height: 630, fit: "crop" })
    : "";

  const readingMinutes = estimateReadingTime(post.body);
  const formattedDate = formatDateLong(post.publishedAt);
  const bodyHtml = renderPortableText(post.body);

  const heroHtml = heroImageUrl
    ? `<figure class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div class="overflow-hidden rounded-2xl border border-border bg-surface-muted">
          <img src="${escapeHtml(heroImageUrl)}" alt="${escapeHtml(post.mainImage?.alt || post.title)}" loading="eager" decoding="async" class="block aspect-[16/9] h-auto w-full object-cover" />
        </div>
        ${post.mainImage?.caption ? `<figcaption class="mt-3 text-center text-sm italic text-text-muted">${escapeHtml(post.mainImage.caption)}</figcaption>` : ""}
      </figure>`
    : "";

  const rootHtml = `<div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <article data-blog-status="ready">
        <header class="relative">
          <div class="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8">
            <a href="/blog" class="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">← Back to all articles</a>
            <h1 class="mt-6 text-3xl font-bold leading-tight tracking-tight text-text sm:text-4xl lg:text-5xl">${escapeHtml(post.title)}</h1>
            ${post.excerpt ? `<p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">${escapeHtml(post.excerpt)}</p>` : ""}
            <div class="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-text-muted">
              ${post.publishedAt ? `<time datetime="${escapeHtml(post.publishedAt)}" class="font-medium">${escapeHtml(formattedDate)}</time><span aria-hidden="true">·</span>` : ""}
              <span>${readingMinutes} min read</span>
            </div>
          </div>
          ${heroHtml}
          <div class="mt-10 sm:mt-14"></div>
        </header>
        <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div class="prose-anchor">${bodyHtml}</div>
          ${renderCtaBlock().replace("mt-16", "my-16")}
        </div>
      </article>
    </main>
  </div>`;

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
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  const headHtml = [
    `<meta name="description" content="${escapeHtml(seoDescription)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:title" content="${escapeHtml(seoTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(seoDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : "",
    ogImage ? `<meta property="og:image:width" content="1200" />` : "",
    ogImage ? `<meta property="og:image:height" content="630" />` : "",
    post.mainImage?.alt
      ? `<meta property="og:image:alt" content="${escapeHtml(post.mainImage.alt)}" />`
      : "",
    post.publishedAt
      ? `<meta property="article:published_time" content="${escapeHtml(post.publishedAt)}" />`
      : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(seoTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seoDescription)}" />`,
    ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />` : "",
    `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    title: fullTitle,
    headHtml,
    rootHtml,
    ssrBootstrap: { scope: "post", slug: post.slug, data: rawPost },
  };
}

export function buildBlogPostNotFoundPage(slug) {
  const title = `Article not found | ${SITE_NAME}`;
  const rootHtml = `<div class="flex min-h-screen flex-col">
    <main class="flex-1">
      <section class="py-24 sm:py-32" data-blog-status="not-found">
        <div class="mx-auto max-w-lg px-4 text-center sm:px-6 lg:px-8">
          <p class="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">Article not found</h1>
          <p class="mt-4 text-base text-text-muted">We couldn't find an article at <code class="rounded bg-surface-muted px-1.5 py-0.5 text-sm">/blog/${escapeHtml(slug)}</code>.</p>
          <div class="mt-8"><a href="/blog" class="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Browse all articles</a></div>
        </div>
      </section>
    </main>
  </div>`;

  return {
    title,
    headHtml: `<meta name="robots" content="noindex,follow" />`,
    rootHtml,
    status: 404,
  };
}
