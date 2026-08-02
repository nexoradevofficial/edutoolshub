"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "eth_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
      } catch {
        setVisible(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const save = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore storage errors */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-white p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-text-muted">
          We use necessary cookies to run EduToolsHub and optional analytics/advertising cookies
          (including Google AdSense) to understand usage and fund free tools. See our{" "}
          <Link href="/cookies" className="font-medium text-primary underline-offset-2 hover:underline">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => save("rejected")}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-surface-muted"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => save("accepted")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
