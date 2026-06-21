"use client";

import ToolPageLayout from "../layouts/ToolPageLayout";
import CertificateMaker from "../components/tools/CertificateMaker";
import { toolSeoById } from "../data/toolSeo";

export default function CertificateMakerPage() {
  return (
    <ToolPageLayout
      title="Certificate Maker"
      description="Design printable student achievement certificates with custom names, titles, school details, and styles — ready to print and sign."
      maxWidth="2xl"
      seo={toolSeoById["certificate-maker"]}
    >
      <CertificateMaker />
    </ToolPageLayout>
  );
}
