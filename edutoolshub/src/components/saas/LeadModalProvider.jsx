"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import LeadModal from "./LeadModal";

const LeadModalContext = createContext(null);

export function LeadModalProvider({ children, productTitle }) {
  const [state, setState] = useState({ open: false, mode: "quote" });

  const openQuote = useCallback(() => {
    setState({ open: true, mode: "quote" });
  }, []);

  const openConsult = useCallback(() => {
    setState({ open: true, mode: "consult" });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const value = useMemo(
    () => ({ openQuote, openConsult, close }),
    [openQuote, openConsult, close]
  );

  return (
    <LeadModalContext.Provider value={value}>
      {children}
      <LeadModal
        open={state.open}
        mode={state.mode}
        productTitle={productTitle}
        onClose={close}
      />
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) {
    throw new Error("useLeadModal must be used within LeadModalProvider");
  }
  return ctx;
}
