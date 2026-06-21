import PercentageToGpaPage from "@/views/PercentageToGpaPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("percentage-to-gpa");

export default function Page() {
  return <PercentageToGpaPage />;
}
