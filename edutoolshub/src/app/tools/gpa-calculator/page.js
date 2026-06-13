import GpaCalculatorPage from "@/views/GpaCalculatorPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("gpa-calculator");

export default function Page() {
  return <GpaCalculatorPage />;
}
