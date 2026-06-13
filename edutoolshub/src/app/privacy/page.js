import PrivacyPolicy from "@/views/PrivacyPolicy";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy Policy — EduToolsHub",
  description:
    "EduToolsHub privacy policy — how we collect, use, and protect your information when you use our free education tools.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
