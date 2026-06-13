import BehaviorChartPage from "@/views/BehaviorChartPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("behavior-chart");

export default function Page() {
  return <BehaviorChartPage />;
}
