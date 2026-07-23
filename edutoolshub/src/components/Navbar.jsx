"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import SiteLogo from "./SiteLogo";
import { IconArrowRight, IconClose, IconMenu } from "./icons/ToolIcons";

const navLinks = [
  { label: "Home", href: "/", end: true },
  { label: "Tools", href: "/tools" },
  { label: "SaaS Solutions", href: "/saas" },
  { label: "Blog", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

function isLinkActive(pathname, href, end) {
  if (end) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const linkBase =
    "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap";
  const linkInactive = "text-text-muted hover:text-text hover:bg-surface-muted";
  const linkActive = "text-primary bg-primary/10";

  const renderDesktopLink = (link) => {
    const active = isLinkActive(pathname, link.href, link.end);
    return (
      <Link
        key={link.label}
        href={link.href}
        className={`${linkBase} ${active ? linkActive : linkInactive}`}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-border/80 bg-white shadow-sm shadow-slate-200/40 md:bg-white/85 md:backdrop-blur-md"
          : "border-b border-transparent bg-white md:bg-white/70 md:backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <SiteLogo
            className="h-9 w-9 shrink-0 rounded-xl object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-text">
            EduTools<span className="text-primary">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-white/80 p-1 shadow-sm md:flex">
          {navLinks.map(renderDesktopLink)}
        </div>

        <div className="hidden items-center lg:flex">
          <Button href="/tools" size="md" className="!px-4">
            Start Free
            <IconArrowRight />
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-muted hover:text-text md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <IconClose /> : <IconMenu />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-border bg-white px-4 py-4 shadow-lg shadow-slate-200/50 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(pathname, link.href, link.end);
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-text-muted hover:bg-surface-muted hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4">
            <Button href="/tools" className="w-full">
              Start Free
              <IconArrowRight />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
