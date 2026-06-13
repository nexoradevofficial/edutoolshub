import Button from "../components/ui/Button";
import { IconArrowRight } from "../components/icons/ToolIcons";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[calc(100vh-12rem)] items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
            404 · Not Found
          </p>
          <h1 className="mt-4 text-6xl font-bold tracking-tight text-text sm:text-7xl">
            Lost in the <span className="text-primary">corridor</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
            We couldn’t find the page you were looking for. It may have moved,
            been renamed, or never existed.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/" size="lg">
              Back to homepage
              <IconArrowRight />
            </Button>
            <Button href="/tools" variant="secondary" size="lg">
              Browse free tools
            </Button>
          </div>

          <p className="mt-8 text-sm text-text-muted">
            Or try the{" "}
            <a
              href="/blog"
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Blog
            </a>
            {" · "}
            <a
              href="/about"
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              About Us
            </a>
            {" · "}
            <a
              href="/contact"
              className="font-medium text-primary hover:text-primary-dark hover:underline"
            >
              Contact
            </a>
          </p>
        </div>
      </section>
  );
}
