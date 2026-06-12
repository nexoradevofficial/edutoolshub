import { buildSitemapXml } from "../sitemap-builder.js";
import { SITE_URL } from "../sitemap-data.js";

export async function handleSitemap(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method not allowed");
  }

  try {
    const xml = await buildSitemapXml(SITE_URL);

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
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
