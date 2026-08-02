import CookiePolicy from "@/views/CookiePolicy";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Cookie Policy — EduToolsHub",
  description:
    "EduToolsHub Cookie Policy — how we use necessary, analytics, and advertising cookies including Google AdSense, and how you can manage preferences.",
  path: "/cookies",
});

export default function CookiesPage() {
  return <CookiePolicy />;
}
