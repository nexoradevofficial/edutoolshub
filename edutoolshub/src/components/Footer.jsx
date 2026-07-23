import Link from "next/link";
import SiteLogo from "./SiteLogo";
import { CONTACT_EMAIL } from "../constants/site";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <SiteLogo />
              <span className="text-lg font-bold text-text">
                EduTools<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-text-muted">
              Free education tools and enterprise SaaS solutions for institutes worldwide.
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/tools" className="text-text-muted transition-colors hover:text-primary">
              Tools
            </Link>
            <Link href="/saas" className="text-text-muted transition-colors hover:text-primary">
              SaaS Solutions
            </Link>
            <Link href="/blog" className="text-text-muted transition-colors hover:text-primary">
              Blog
            </Link>
            <Link href="/about" className="text-text-muted transition-colors hover:text-primary">
              About Us
            </Link>
            <Link href="/contact" className="text-text-muted transition-colors hover:text-primary">
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-text-muted transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-text-muted transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-text-muted transition-colors hover:text-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-8 text-center text-sm text-text-muted sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} EduToolsHub. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a
              href="https://nexora-dev-official.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary transition-colors hover:text-primary-dark"
            >
              Nexora Dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
