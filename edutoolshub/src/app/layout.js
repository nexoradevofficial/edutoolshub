import "@/app/globals.css";
import "@/print.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { SITE_NAME, SITE_URL, DEFAULT_LOGO_PATH } from "@/constants/site";

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
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_LOGO_PATH, width: 72, height: 72 }],
  },
  icons: {
    icon: DEFAULT_LOGO_PATH,
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_LOGO_PATH],
  },
};

export const viewport = {
  themeColor: "#2563eb",
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
