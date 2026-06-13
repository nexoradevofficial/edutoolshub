import GpaRequirementCheckerPage from "@/views/GpaRequirementCheckerPage";
import { buildToolPageMetadata } from "@/lib/tool-page";
import { loadUniversitiesForPage } from "@/lib/universities-server";

export const metadata = buildToolPageMetadata("gpa-requirement-checker");

export const revalidate = 86400;

export default async function Page() {
  const { data, error } = await loadUniversitiesForPage();
  return (
    <GpaRequirementCheckerPage initialUniversities={data} initialError={error} />
  );
}
