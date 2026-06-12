import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";
import { handlePostsRequest } from "./server/lib/posts-handler.js";
import { buildSitemapXml } from "./server/lib/sitemap-builder.js";
import { SITE_URL } from "./server/lib/sitemap-data.js";

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
    plugins: [react(), tailwindcss(), vercelApiDevPlugin(env)],
    build: {
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
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
