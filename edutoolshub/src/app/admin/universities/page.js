import { redirect } from "next/navigation";
import AdminUniversitiesPage from "@/views/AdminUniversitiesPage";

export const metadata = {
  title: "Admin — Universities | EduToolsHub",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_OPEN_ADMIN_REFRESH !== "true"
  ) {
    redirect("/");
  }

  return <AdminUniversitiesPage />;
}
