import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import { handlePostsRequest } from "./server/lib/posts-handler.js";
import { buildSitemapXml } from "./server/lib/sitemap-builder.js";
import { SITE_URL } from "./server/lib/sitemap-data.js";

/** Embed dist/index.html for Vercel SSR (serverless functions cannot read dist/ at runtime). */
function embedAppShellPlugin() {
  return {
    name: "embed-app-shell",
    closeBundle() {
      const indexHtml = readFileSync(resolve("dist/index.html"), "utf-8");
      const outPath = resolve("server/lib/app-shell.html");
      writeFileSync(outPath, indexHtml, "utf-8");
    },
  };
}

/** Non-blocking CSS + defer scripts to body for faster first paint. */
function perfHtmlPlugin() {
  return {
    name: "perf-html",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const asyncCss = (href) =>
          `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all';this.onload=null"><noscript><link rel="stylesheet" href="${href}"></noscript>`;

        let out = html.replace(
          /<link rel="preload" as="style" href="(\/assets\/[^"]+\.css)" onload="[^"]*"><noscript><link rel="stylesheet" href="[^"]*"><\/noscript>/g,
          (_, href) => asyncCss(href)
        );

        out = out.replace(
          /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
          (_, href) => asyncCss(href)
        );

        out = out.replace(
          /<link rel="stylesheet" href="(\/assets\/[^"]+\.css)">/g,
          (_, href) => asyncCss(href)
        );

        const scripts = out.match(/<script type="module"[^>]*><\/script>/g) ?? [];
        const preloads = out.match(/<link rel="modulepreload"[^>]*>/g) ?? [];

        for (const tag of [...scripts, ...preloads]) {
          out = out.replace(tag, "");
        }

        out = out.replace(
          "</body>",
          `${preloads.join("\n    ")}\n    ${scripts.join("\n    ")}\n  </body>`
        );

        return out;
      },
    },
  };
}

/** API routes for dev + `vite preview` (prerender uses preview; mirrors Vercel handlers). */
function vercelApiDevPlugin(env) {
  function attachApiMiddleware(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === "/sitemap.xml" && req.method === "GET") {
        try {
          process.env.VITE_SANITY_PROJECT_ID ??= env.VITE_SANITY_PROJECT_ID;
          process.env.VITE_SANITY_DATASET ??= env.VITE_SANITY_DATASET;
          const xml = await buildSitemapXml(SITE_URL);
          res.setHeader("Content-Type", "application/xml; charset=utf-8");
          res.end(xml);
        } catch (err) {
          res.statusCode = 500;
          res.end(err.message || "Failed to generate sitemap");
        }
        return;
      }

      if (!req.url?.startsWith("/api/posts")) return next();
      if (req.method !== "GET") return next();

      const url = new URL(req.url, "http://localhost");
      const scope = url.searchParams.get("scope");
      const slug = url.searchParams.get("slug");

      try {
        process.env.VITE_SANITY_PROJECT_ID ??= env.VITE_SANITY_PROJECT_ID;
        process.env.VITE_SANITY_DATASET ??= env.VITE_SANITY_DATASET;

        const data = await handlePostsRequest(scope, slug);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ data }));
      } catch (err) {
        res.statusCode = err.message?.includes("Invalid scope") ? 400 : 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: err.message || "Failed to fetch posts" }));
      }
    });
  }

  return {
    name: "vercel-api-dev",
    configureServer: attachApiMiddleware,
    configurePreviewServer: attachApiMiddleware,
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss(), perfHtmlPlugin(), embedAppShellPlugin(), vercelApiDevPlugin(env)],
    build: {
      target: "es2022",
      modulePreload: {
        resolveDependencies: (_filename, deps, { hostType }) => {
          if (hostType === "html") {
            return deps.filter((dep) => !dep.includes("vendor-"));
          }
          return deps.filter(
            (dep) =>
              !dep.includes("vendor-sanity") &&
              !dep.includes("vendor-embla") &&
              !dep.includes("vendor-portabletext") &&
              !dep.includes("vendor-date-fns") &&
              !dep.includes("vendor-jspdf") &&
              !dep.includes("vendor-html2canvas")
          );
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("jspdf")) return "vendor-jspdf";
            if (id.includes("html2canvas")) return "vendor-html2canvas";
            if (id.includes("@sanity") || id.includes("/sanity/"))
              return "vendor-sanity";
            if (id.includes("embla-carousel")) return "vendor-embla";
            if (id.includes("@portabletext")) return "vendor-portabletext";
            if (id.includes("date-fns")) return "vendor-date-fns";
            if (id.includes("react-router")) return "vendor-router";
            if (id.includes("react-dom") || id.includes("/react/"))
              return "vendor-react";
          },
        },
      },
    },
  };
});
