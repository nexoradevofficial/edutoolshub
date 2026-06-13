import { buildPageMetadata } from "@/lib/metadata";
import { toolSeoById } from "@/data/toolSeo";

export function buildToolPageMetadata(toolId) {
  const seo = toolSeoById[toolId];
  if (!seo) return {};
  return buildPageMetadata({
    title: seo.metaTitle,
    description: seo.metaDescription,
    path: seo.path,
  });
}
