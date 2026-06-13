import GpaToPercentagePage from "@/views/GpaToPercentagePage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("gpa-to-percentage");

export default function Page() {
  return <GpaToPercentagePage />;
}
