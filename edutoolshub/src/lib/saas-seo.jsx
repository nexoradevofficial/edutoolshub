import { SITE_NAME, SITE_URL, DEFAULT_LOGO_PATH } from "@/constants/site";
import { getAllSaasSolutions } from "@/data/saasSolutions";
import { buildPageMetadata } from "@/lib/metadata";

/**
 * Auto-builds sitemap entries from saasSolutions.js.
 * Adding a new product object is enough — no manual sitemap edits needed.
 */
export function getSaasSitemapPages() {
  return getAllSaasSolutions().map((product) => ({
    path: `/saas/${product.slug}`,
    priority: product.seo?.sitemapPriority ?? "0.9",
    changefreq: product.seo?.changefreq ?? "weekly",
  }));
}

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildSaasMarketplaceMetadata() {
  return buildPageMetadata({
    title: "Enterprise SaaS Solutions Marketplace | EduToolsHub",
    description:
      "Explore EduToolsHub cloud SaaS products for schools, colleges and businesses. School & College Management System with fees, QR attendance, WhatsApp messaging, exams and Admin/Teacher portals.",
    path: "/saas",
    keywords: [
      "SaaS marketplace Pakistan",
      "school management system",
      "college ERP software",
      "education SaaS",
      "cloud school software",
      "institute management system",
      "EduToolsHub SaaS",
      "fee management software",
      "QR attendance system",
    ].join(", "),
    ogImage: absoluteUrl("/saas/school-college/dashboard-full.png"),
  });
}

export function buildSaasProductMetadata(product) {
  const path = `/saas/${product.slug}`;
  const ogImage = absoluteUrl(
    product.seo?.ogImage || product.images?.dashboard || product.images?.hero || DEFAULT_LOGO_PATH
  );

  return buildPageMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path,
    keywords: product.seo.keywords,
    ogImage,
    ogType: "website",
  });
}

export function saasMarketplaceJsonLd() {
  const products = getAllSaasSolutions();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/saas#collection`,
        name: "Enterprise SaaS Solutions | EduToolsHub",
        description:
          "Cloud SaaS marketplace for educational institutes and businesses by EduToolsHub.",
        url: `${SITE_URL}/saas`,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
        breadcrumb: { "@id": `${SITE_URL}/saas#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/saas#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "SaaS Solutions",
            item: `${SITE_URL}/saas`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "EduToolsHub SaaS Products",
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.title,
          url: `${SITE_URL}/saas/${product.slug}`,
          description: product.seo?.description || product.description,
        })),
      },
    ],
  };
}

export function saasProductJsonLd(product) {
  const url = `${SITE_URL}/saas/${product.slug}`;
  const image = absoluteUrl(
    product.seo?.ogImage || product.images?.dashboard || product.images?.hero || DEFAULT_LOGO_PATH
  );
  const plan = product.pricing?.plans?.[0];

  const graph = [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "SaaS Solutions",
          item: `${SITE_URL}/saas`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.title,
          item: url,
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#software`,
      name: product.title,
      alternateName: product.shortTitle,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "EducationManagement",
      operatingSystem: "Web Browser",
      description: product.seo?.description || product.description,
      url,
      image,
      featureList: product.modules?.map((m) => m.title).join(", "),
      screenshot: (product.screenshots || [])
        .map((s) => absoluteUrl(s.image))
        .filter(Boolean),
      offers: plan
        ? {
            "@type": "Offer",
            name: plan.name,
            price: String(plan.pricePkr ?? ""),
            priceCurrency: "PKR",
            availability: "https://schema.org/InStock",
            url,
            priceValidUntil: plan.saleValidUntil
              ? "2026-08-31"
              : undefined,
            description: plan.features?.join(", "),
          }
        : undefined,
      provider: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        email: "nexoradevofficial@gmail.com",
      },
      brand: {
        "@type": "Brand",
        name: SITE_NAME,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: (product.faq || []).map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@type": "WebPage",
      "@id": url,
      url,
      name: product.seo?.title || product.title,
      description: product.seo?.description || product.description,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      primaryImageOfPage: { "@type": "ImageObject", url: image },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
