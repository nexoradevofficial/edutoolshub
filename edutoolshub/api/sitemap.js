/**
 * Dynamic sitemap — static pages, tool pages, and published blog posts from Sanity.
 * Served at /sitemap.xml via vercel.json rewrite.
 * New blog posts are picked up automatically on each request (cached briefly).
 */

import { buildSitemapXml } from "./lib/sitemap-builder.js";
import { SITE_URL } from "./lib/sitemap-data.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  try {
    const xml = await buildSitemapXml(SITE_URL);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    // Short cache so newly published Sanity posts appear in the sitemap quickly
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=3600"
    );
    return res.status(200).send(xml);
  } catch (err) {
    console.error("[sitemap]", err);
    return res.status(500).end("Failed to generate sitemap");
  }
}
