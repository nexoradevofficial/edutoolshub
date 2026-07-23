import { notFound } from "next/navigation";
import {
  getAllSaasSlugs,
  getSaasBySlug,
} from "@/data/saasSolutions";
import {
  buildSaasProductMetadata,
  JsonLd,
  saasProductJsonLd,
} from "@/lib/saas-seo";
import { buildPageMetadata } from "@/lib/metadata";
import SaaSProductLanding from "@/views/SaaSProductLanding";

export function generateStaticParams() {
  return getAllSaasSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getSaasBySlug(slug);
  if (!product) {
    return buildPageMetadata({
      title: "SaaS Solution Not Found | EduToolsHub",
      description: "The requested SaaS solution could not be found.",
      path: `/saas/${slug}`,
      noIndex: true,
    });
  }

  return buildSaasProductMetadata(product);
}

export default async function SaaSProductPage({ params }) {
  const { slug } = await params;
  const product = getSaasBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd data={saasProductJsonLd(product)} />
      <SaaSProductLanding product={product} />
    </>
  );
}
