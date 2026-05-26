import ToolPageLayout from "../layouts/ToolPageLayout";
import AttendanceGenerator from "../components/tools/AttendanceGenerator";

export default function AttendancePage() {
  return (
    <ToolPageLayout
      title="Attendance Sheet Generator"
      description="Build a printable monthly class register with your institute logo, custom dates, marked holidays, custom columns, and upside-down Sunday labels — designed for schools and colleges worldwide."
      maxWidth="2xl"
    >
      <AttendanceGenerator />
    </ToolPageLayout>
  );
}
