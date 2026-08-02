import { SITE_URL } from "@/constants/site";

export default function robots() {
  const siteUrl = process.env.SITE_URL || SITE_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          // Thin templated university detail URLs — keep hub indexable
          "/tools/college-university-gpa-requirement-checker/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
