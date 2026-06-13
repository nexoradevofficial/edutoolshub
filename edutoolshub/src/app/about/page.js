import About from "@/views/About";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "About EduToolsHub — Free Education Tools for Students & Teachers",
  description:
    "Learn about EduToolsHub — our mission to provide free, no-signup education tools for students and teachers worldwide.",
  path: "/about",
});

export default function AboutPage() {
  return <About />;
}
