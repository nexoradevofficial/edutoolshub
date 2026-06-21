import RubricGeneratorPage from "@/views/RubricGeneratorPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("rubric-generator");

export default function Page() {
  return <RubricGeneratorPage />;
}
