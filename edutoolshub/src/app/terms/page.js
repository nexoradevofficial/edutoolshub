import TermsOfService from "@/views/TermsOfService";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Terms of Service — EduToolsHub",
  description:
    "EduToolsHub terms of service — rules and guidelines for using our free education tools and website.",
  path: "/terms",
});

export default function TermsPage() {
  return <TermsOfService />;
}
