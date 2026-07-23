"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronsUpDown, Search } from "lucide-react";
import { PHONE_COUNTRIES, getPhoneCountry } from "@/lib/phoneCountries";

export default function CountryPhoneSelect({ value, onChange, id = "lead-country" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const country = getPhoneCountry(value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PHONE_COUNTRIES;
    return PHONE_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q.replace("+", "")) ||
        c.code.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full sm:w-[13.5rem] sm:shrink-0">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-saas-ink outline-none transition hover:border-slate-300 focus:border-saas-teal focus:ring-2 focus:ring-saas-teal/20"
      >
        <span className="min-w-0 truncate">
          <span className="mr-1.5">{country.flag}</span>
          <span className="font-medium">+{country.dial}</span>
          <span className="ml-1.5 text-slate-400">{country.code}</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-30 mt-1.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/80 sm:w-[20rem]">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code…"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-saas-teal focus:ring-2 focus:ring-saas-teal/20"
              />
            </div>
          </div>
          <ul
            role="listbox"
            aria-label="Country"
            className="max-h-56 overflow-y-auto overscroll-contain py-1"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-3 text-center text-sm text-slate-400">No countries found</li>
            )}
            {filtered.map((c) => {
              const active = c.code === value;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition ${
                      active
                        ? "bg-teal-50 text-saas-teal-dark"
                        : "text-saas-ink hover:bg-slate-50"
                    }`}
                    onClick={() => {
                      onChange(c.code);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span className="w-6 text-base">{c.flag}</span>
                    <span className="min-w-0 flex-1 truncate">{c.name}</span>
                    <span className="shrink-0 tabular-nums text-slate-400">+{c.dial}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-slate-100 px-3 py-1.5 text-[10px] text-slate-400">
            {PHONE_COUNTRIES.length} countries · format updates with selection
          </p>
        </div>
      )}
    </div>
  );
}
