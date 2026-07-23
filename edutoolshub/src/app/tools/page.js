import Tools from "@/views/Tools";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Free Education Tools — GPA, Attendance & School SaaS | EduToolsHub",
  description:
    "Browse free online tools for students and teachers — GPA calculator, attendance sheets, lesson planner — and discover our School & College Management System SaaS.",
  path: "/tools",
  keywords:
    "free education tools, GPA calculator, attendance sheet, lesson planner, school management system, EduToolsHub",
});

export default function ToolsPage() {
  return <Tools />;
}
