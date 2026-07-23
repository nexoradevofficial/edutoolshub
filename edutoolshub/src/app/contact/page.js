import Contact from "@/views/Contact";
import SaasPromoSection from "@/components/SaasPromoSection";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contact EduToolsHub — Tools, Support & School SaaS Demo",
  description:
    "Contact EduToolsHub for tool feedback, partnerships, or a School & College Management System demo. WhatsApp and email support available.",
  path: "/contact",
  keywords:
    "contact EduToolsHub, school management demo, education SaaS support, tool feedback",
});

export default function ContactPage() {
  return (
    <>
      <SaasPromoSection variant="banner" />
      <Contact />
      <SaasPromoSection variant="compact" id="contact-saas" />
    </>
  );
}
