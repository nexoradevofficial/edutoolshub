/**
 * Post-build prerender step.
 *
 * 1. Loads VITE_SANITY_PROJECT_ID / VITE_SANITY_DATASET from .env.local (Vite-style)
 * 2. Fetches every published blog slug from Sanity (all current + any new posts
 *    published before this build — redeploy after publishing to pick up new slugs)
 * 3. Boots `vite preview` programmatically (SPA fallback handles unknown routes)
 * 4. For each known route, opens it in headless Chromium, waits for the React app
 *    to render and Helmet to flush meta tags into <head>, then snapshots `document`
 *    and writes the full HTML to dist/<route>/index.html
 * 5. Writes dist/sitemap.xml and dist/_redirects (SPA fallback for routes
 *    not snapshotted, e.g. newly published blog posts before redeploy)
 *
 * Run via: `npm run build:prerender`
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";
import { loadEnv, preview } from "vite";

// Puppeteer runs in two different ways:
//   - Local dev (Windows / macOS): plain `puppeteer` with its bundled Chromium.
//   - Vercel / Lambda (Amazon Linux 2): the bundled Chromium is missing
//     system libs (libnspr4, libnss3, etc), so we use @sparticuz/chromium
//     which ships a self-contained Chromium with all libs baked in.
const isServerless =
  !!process.env.VERCEL ||
  !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
  !!process.env.NETLIFY;

async function loadPuppeteer() {
  if (isServerless) {
    const [{ default: puppeteer }, { default: chromium }] = await Promise.all([
      import("puppeteer-core"),
      import("@sparticuz/chromium"),
    ]);
    return {
      puppeteer,
      launchOptions: {
        headless: true,
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
      },
    };
  }
  const { default: puppeteer } = await import("puppeteer");
  return {
    puppeteer,
    launchOptions: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const distDir = resolve(projectRoot, "dist");

const SITE_URL = process.env.SITE_URL || "https://edutoolshub.com";
const PREVIEW_PORT = 4173;
const PREVIEW_HOST = "127.0.0.1";
const PAGE_TIMEOUT = 30_000;
const SETTLE_MS = 400;

/** Blog routes are SSR'd at runtime via /api/render-blog* — do not prerender to dist/blog/. */
const STATIC_ROUTES = [
  "/",
  "/tools",
  "/tools/gpa-calculator",
  "/tools/college-university-gpa-requirement-checker",
  "/tools/attendance-sheet",
  "/tools/final-grade-calculator",
  "/tools/gpa-to-percentage",
  "/tools/fee-receipt",
  "/about",
  "/contact",
  "/privacy",
];

/** Pages listed in sitemap.xml — static pages + blog posts (no university detail URLs). */
const SITEMAP_ROUTES = [
  "/",
  "/tools",
  "/blog",
  ...STATIC_ROUTES.filter((r) => r !== "/" && r !== "/tools"),
];

async function fetchBlogSlugs(env) {
  const projectId = env.VITE_SANITY_PROJECT_ID;
  const dataset = env.VITE_SANITY_DATASET || "production";

  if (!projectId) {
    console.warn(
      "[prerender] VITE_SANITY_PROJECT_ID not set — skipping blog slugs. Only static routes will be prerendered."
    );
    return [];
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2025-01-01",
    useCdn: false,
    perspective: "published",
  });

  try {
    const rows = await client.fetch(
      `*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()]{
        "slug": slug.current
      }`
    );
    if (!Array.isArray(rows)) return [];
    return rows
      .map((r) => {
        const s = String(r.slug ?? "").replace(/^\/+|\/+$/g, "").trim();
        return s && s !== "null" ? s : "";
      })
      .filter(Boolean);
  } catch (err) {
    console.warn(
      `[prerender] Could not fetch blog slugs from Sanity (${err.message}). Static routes only.`
    );
    return [];
  }
}

function outputPathForRoute(route) {
  if (route === "/") return resolve(distDir, "index.html");
  return resolve(distDir, route.replace(/^\//, ""), "index.html");
}

function generateSitemap(routes) {
  const now = new Date().toISOString().slice(0, 10);
  const items = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route === "/" ? "" : route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${route.startsWith("/blog") ? "weekly" : "monthly"}</changefreq>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function generateRedirects() {
  // Netlify / Cloudflare: explicit blog SPA fallbacks, then global fallback
  return [
    "/blog/null  /blog  302",
    "/tools/exam-marks-needed  /tools/final-grade-calculator  301",
    "/tools/gpa-requirement-checker  /tools/college-university-gpa-requirement-checker  301",
    "/tools/gpa-requirement-checker/*  /tools/college-university-gpa-requirement-checker/:splat  301",
    "/blog/*  /index.html  200",
    "/blog  /index.html  200",
    "/*  /index.html  200",
  ].join("\n") + "\n";
}

function generateRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

async function renderRoute(page, baseUrl, route) {
  const url = `${baseUrl}${route}`;

  // 'load' instead of 'networkidle0': networkidle0 can fire BEFORE the React
  // app has had time to mount and start its own fetches to Sanity. We make up
  // for that by explicitly waiting for loading skeletons to disappear below.
  await page.goto(url, { waitUntil: "load", timeout: PAGE_TIMEOUT });

  await page.waitForSelector("main", { timeout: 10_000 });

  const isBlogList = route === "/blog";
  const isBlogPost = route.startsWith("/blog/") && route !== "/blog";

  if (isBlogPost) {
    // Blog posts fetch from Sanity after mount — wait for the real article,
    // not the loading skeleton or a 404 shell.
    await page
      .waitForSelector('article[data-blog-status="ready"]', {
        timeout: PAGE_TIMEOUT,
      })
      .catch(() => {
        console.warn(
          `    ⚠ Blog content wait timed out for ${route} — capturing whatever is rendered.`
        );
      });
  } else if (isBlogList) {
    await page
      .waitForSelector('[data-blog-list-status="ready"]', {
        timeout: PAGE_TIMEOUT,
      })
      .catch(() => {
        console.warn(
          `    ⚠ Blog list wait timed out for ${route} — capturing whatever is rendered.`
        );
      });
  } else {
    // Wait until every loading skeleton inside <main> is gone. Skeletons are
    // marked with `.animate-pulse`; once data resolves the component re-renders
    // without them. For static routes that never had skeletons, this resolves
    // immediately.
    await page
      .waitForFunction(
        () => !document.querySelector("main .animate-pulse"),
        { timeout: 15_000 }
      )
      .catch(() => {
        console.warn(
          "    ⚠ Skeleton wait timed out — capturing whatever is rendered."
        );
      });
  }

  // Extra tick so react-helmet-async can flush <title> and <meta> into <head>.
  const settleMs = isBlogPost ? 800 : SETTLE_MS;
  await new Promise((r) => setTimeout(r, settleMs));

  // Dedupe duplicate <head> tags. react-helmet-async + React 19 leaves stale
  // tags around (it appends without removing the original index.html tags or
  // outer-component tags). The dedup rules differ by tag type because Helmet
  // inserts them differently:
  //
  // - <title>:   Helmet prepends (deepest first), so KEEP FIRST.
  // - <meta>:    Helmet appends in component-render order (outer first,
  //              deepest last), so we KEEP LAST to honor "deepest wins".
  // - <link>:    Same as <meta> — keep last per logical key.
  await page.evaluate(() => {
    const head = document.head;

    // <title>: keep first only (Helmet prepends, so first is most specific)
    const titles = head.querySelectorAll("title");
    for (let i = 1; i < titles.length; i++) titles[i].remove();

    // <meta>: walk in reverse, keep first seen (= last in DOM = most specific)
    const seenMeta = new Set();
    const metas = Array.from(head.querySelectorAll("meta"));
    for (let i = metas.length - 1; i >= 0; i--) {
      const meta = metas[i];
      const key =
        meta.getAttribute("name") ||
        meta.getAttribute("property") ||
        meta.getAttribute("http-equiv");
      // skip non-keyed metas like charset / viewport (already unique)
      if (!key) continue;
      if (seenMeta.has(key)) meta.remove();
      else seenMeta.add(key);
    }

    // <link>: same logic, but only dedupe rels that should be singletons
    const dedupeRels = new Set(["canonical", "alternate", "icon", "manifest"]);
    const seenLink = new Set();
    const links = Array.from(head.querySelectorAll("link"));
    for (let i = links.length - 1; i >= 0; i--) {
      const link = links[i];
      const rel = link.getAttribute("rel");
      if (!rel || !dedupeRels.has(rel)) continue;
      if (seenLink.has(rel)) link.remove();
      else seenLink.add(rel);
    }
  });

  return page.content();
}

/** True when the React app rendered a blog 404 or global NotFound page. */
function isNotFoundHtml(html, route) {
  if (route.startsWith("/blog/")) {
    return (
      html.includes("Article not found") ||
      html.includes('data-blog-status="not-found"')
    );
  }
  return html.includes("Lost in the") && html.includes("404 · Not Found");
}

async function main() {
  console.log("[prerender] Loading env from .env.local");
  const env = loadEnv("production", projectRoot, "");

  console.log("[prerender] Fetching blog slugs from Sanity…");
  const slugs = await fetchBlogSlugs(env);
  console.log(
    `[prerender] Found ${slugs.length} published blog post(s) for sitemap (SSR at runtime, not prerendered).`
  );

  const blogRoutes = slugs.map((s) => `/blog/${s}`);
  const uniquePrerenderRoutes = Array.from(new Set(STATIC_ROUTES));
  const sitemapRoutes = Array.from(new Set([...SITEMAP_ROUTES, ...blogRoutes]));

  // Static dist/blog/*.html takes precedence over Vercel rewrites — remove any leftovers.
  const blogDistDir = resolve(distDir, "blog");
  if (existsSync(blogDistDir)) {
    rmSync(blogDistDir, { recursive: true, force: true });
    console.log("[prerender] Removed dist/blog/ so Vercel SSR rewrites can serve /blog.");
  }

  console.log("[prerender] Starting `vite preview` server…");
  const previewServer = await preview({
    root: projectRoot,
    preview: { port: PREVIEW_PORT, host: PREVIEW_HOST, strictPort: true },
  });

  const baseUrl = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
  let browser;

  try {
    console.log(
      `[prerender] Launching headless Chromium (${isServerless ? "serverless / @sparticuz/chromium" : "local / puppeteer"})…`
    );
    const { puppeteer, launchOptions } = await loadPuppeteer();
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let successCount = 0;
    let failCount = 0;

    for (const route of uniquePrerenderRoutes) {
      try {
        const html = await renderRoute(page, baseUrl, route);
        if (isNotFoundHtml(html, route)) {
          failCount++;
          console.warn(`  ✗ ${route} — rendered 404, skipped writing HTML`);
          continue;
        }
        if (
          route.startsWith("/blog/") &&
          !html.includes('data-blog-status="ready"')
        ) {
          failCount++;
          console.warn(
            `  ✗ ${route} — article content missing, skipped writing HTML`
          );
          continue;
        }
        const outPath = outputPathForRoute(route);
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, html, "utf-8");
        successCount++;
        console.log(`  ✓ ${route}`);
      } catch (err) {
        failCount++;
        console.warn(`  ✗ ${route} — ${err.message}`);
      }
    }

    console.log("[prerender] Writing sitemap.xml, robots.txt, _redirects…");
    writeFileSync(resolve(distDir, "sitemap.xml"), generateSitemap(sitemapRoutes), "utf-8");
    writeFileSync(resolve(distDir, "robots.txt"), generateRobotsTxt(), "utf-8");
    writeFileSync(resolve(distDir, "_redirects"), generateRedirects(), "utf-8");

    console.log(
      `[prerender] Done. ${successCount} rendered, ${failCount} failed, ${uniquePrerenderRoutes.length} static route(s), ${blogRoutes.length} blog URL(s) in sitemap (SSR at runtime).`
    );
    if (failCount > 0) process.exitCode = 1;
  } finally {
    if (browser) await browser.close().catch(() => {});
    await new Promise((resolveClose, rejectClose) => {
      previewServer.httpServer.close((err) => (err ? rejectClose(err) : resolveClose()));
    }).catch(() => {});
  }
}

main().catch((err) => {
  console.error("[prerender] Failed:", err);
  process.exit(1);
});
