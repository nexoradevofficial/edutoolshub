import {
  buildSaasMarketplaceMetadata,
  JsonLd,
  saasMarketplaceJsonLd,
} from "@/lib/saas-seo";
import SaaSMarketplace from "@/views/SaaSMarketplace";

export const metadata = buildSaasMarketplaceMetadata();

export default function SaaSPage() {
  return (
    <>
      <JsonLd data={saasMarketplaceJsonLd()} />
      <SaaSMarketplace />
    </>
  );
}
