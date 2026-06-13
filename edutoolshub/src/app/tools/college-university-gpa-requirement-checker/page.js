import GpaRequirementCheckerPage from "@/views/GpaRequirementCheckerPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("gpa-requirement-checker");

export default function Page() {
  return <GpaRequirementCheckerPage />;
}
