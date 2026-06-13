import NotFound from "@/views/NotFound";

export const metadata = {
  title: "Page not found — EduToolsHub",
  description:
    "The page you're looking for doesn't exist. Head back to the homepage or browse our free educational tools.",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return <NotFound />;
}
