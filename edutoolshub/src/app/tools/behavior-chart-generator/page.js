import BehaviorChartPage from "@/views/BehaviorChartPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("behavior-chart-generator");

export default function Page() {
  return <BehaviorChartPage />;
}
