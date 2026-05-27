import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Button from "./ui/Button";
import { IconArrowRight, IconClose, IconMenu } from "./icons/ToolIcons";

const navLinks = [
  { label: "Home", to: "/", end: true },
  { label: "Tools", to: "/tools" },
  { label: "Blog", to: "/blog" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Privacy", to: "/privacy" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const linkBase =
    "relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap";
  const linkInactive = "text-text-muted hover:text-text hover:bg-surface-muted";
  const linkActive = "text-primary bg-primary/10";

  const renderDesktopLink = (link) => {
    if (link.hash) {
      return (
        <a
          key={link.label}
          href={link.to}
          className={`${linkBase} ${linkInactive}`}
        >
          {link.label}
        </a>
      );
    }
    return (
      <NavLink
        key={link.label}
        to={link.to}
        end={link.end}
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkInactive}`
        }
      >
        {link.label}
      </NavLink>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-border/80 bg-white/85 shadow-sm shadow-slate-200/40 backdrop-blur-md"
          : "border-b border-transparent bg-white/70 backdrop-blur"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="EduToolsHub logo"
            width="36"
            height="36"
            className="h-9 w-9 shrink-0 rounded-xl object-contain transition-transform group-hover:scale-105"
            loading="eager"
            decoding="async"
            fetchPriority="low"
          />
          <span className="text-lg font-bold tracking-tight text-text">
            EduTools<span className="text-primary">Hub</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-border bg-white/80 p-1 shadow-sm md:flex">
          {navLinks.map(renderDesktopLink)}
        </div>

        <div className="hidden items-center lg:flex">
          <Button to="/tools" size="md" className="!px-4">
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
            {navLinks.map((link) =>
              link.hash ? (
                <li key={link.label}>
                  <a
                    href={link.to}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-muted hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-text-muted hover:bg-surface-muted hover:text-primary"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              )
            )}
          </ul>
          <div className="mt-4">
            <Button to="/tools" className="w-full">
              Start Free
              <IconArrowRight />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
