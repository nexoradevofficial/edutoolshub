import ToolPageLayout from "../layouts/ToolPageLayout";
import FeeReceiptGenerator from "../components/tools/FeeReceiptGenerator";

export default function FeeReceiptPage() {
  return (
    <ToolPageLayout
      title="Fee Receipt Generator"
      description="Create professional school fee receipts with subject-wise breakdowns, discounts, tax, and payment details — preview live and download as PDF."
      maxWidth="3xl"
    >
      <FeeReceiptGenerator />
    </ToolPageLayout>
  );
}
