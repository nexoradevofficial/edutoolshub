import About from "@/views/About";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "About EduToolsHub — Free Tools & School Management SaaS",
  description:
    "Learn about EduToolsHub — free no-signup education tools for students and teachers, plus School & College Management System cloud SaaS for institutes.",
  path: "/about",
  keywords:
    "about EduToolsHub, free education tools, school management system, education SaaS",
});

export default function AboutPage() {
  return <About />;
}
