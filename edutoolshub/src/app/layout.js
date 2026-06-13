import "@/app/globals.css";
import "@/print.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { SITE_NAME, SITE_URL } from "@/constants/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EduToolsHub — Smart Tools for Students & Teachers",
    template: "%s",
  },
  description:
    "Free smart tools for students and teachers — GPA calculator, college GPA requirement checker, attendance sheets, timetables, seating plans, and more.",
  keywords:
    "education tools, GPA calculator, university GPA requirements, college admission GPA, attendance sheet, timetable builder, seating plan, report card generator, students, teachers",
  themeColor: "#2563eb",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/logo.png", width: 1024, height: 1024 }],
  },
  icons: {
    icon: "/logo.png",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
