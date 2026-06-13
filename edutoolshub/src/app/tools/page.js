import Tools from "@/views/Tools";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Free Education Tools — GPA, Attendance, Lesson Planner | EduToolsHub",
  description:
    "Browse free online tools for students and teachers — GPA calculator, college GPA requirement checker, attendance sheet generator, lesson planner, and more.",
  path: "/tools",
});

export default function ToolsPage() {
  return <Tools />;
}
