import FeeReceiptPage from "@/views/FeeReceiptPage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("fee-receipt");

export default function Page() {
  return <FeeReceiptPage />;
}
