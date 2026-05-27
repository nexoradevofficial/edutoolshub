import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DefaultMeta from "../components/DefaultMeta";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <DefaultMeta />
      <Navbar />
      <main className="flex-1">
        {isHome ? (
          <Outlet />
        ) : (
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
}

function PageFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
