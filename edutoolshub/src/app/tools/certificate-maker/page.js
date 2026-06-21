import CertificateMakerPage from "@/views/CertificateMakerPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("certificate-maker");

export default function Page() {
  return <CertificateMakerPage />;
}
