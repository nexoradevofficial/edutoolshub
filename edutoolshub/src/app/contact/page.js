import Contact from "@/views/Contact";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Contact EduToolsHub — Get in Touch",
  description:
    "Contact the EduToolsHub team with questions, feedback, or partnership inquiries. We read every message.",
  path: "/contact",
});

export default function ContactPage() {
  return <Contact />;
}
