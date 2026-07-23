"use client";

import { useLeadModal } from "./LeadModalProvider";

export default function MarketplaceLeadCTAs() {
  const { openQuote, openConsult } = useLeadModal();

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={openQuote}
        className="rounded-2xl bg-saas-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-saas-ink/20 transition hover:-translate-y-0.5"
      >
        Request a Quote
      </button>
      <button
        type="button"
        onClick={openConsult}
        className="rounded-2xl border border-teal-200 bg-teal-50 px-5 py-3 text-sm font-semibold text-saas-teal-dark transition hover:-translate-y-0.5 hover:bg-teal-100"
      >
        Start Free Consultation
      </button>
    </div>
  );
}
