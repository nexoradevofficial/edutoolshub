import AttendancePage from "@/views/AttendancePage";
import { buildToolPageMetadata } from "@/lib/tool-page";

export const metadata = buildToolPageMetadata("attendance-sheet");

export default function Page() {
  return <AttendancePage />;
}
