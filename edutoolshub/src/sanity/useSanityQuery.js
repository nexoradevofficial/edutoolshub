import { useEffect, useRef, useState } from "react";
import { sanityClient } from "./client";

/**
 * Small wrapper around `sanityClient.fetch` that returns `{ data, error, isLoading }`.
 *
 * - Re-runs whenever the query string or stringified params change.
 * - Cancels stale responses so unmounted / superseded queries never call setState.
 * - Treats a missing VITE_SANITY_PROJECT_ID as an error so the UI can surface it
 *   instead of silently rendering an empty state.
 */
export function useSanityQuery(query, params) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const paramsKey = params ? JSON.stringify(params) : "";
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);

    if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
      setError(
        new Error(
          "Sanity is not configured. Set VITE_SANITY_PROJECT_ID in .env.local and restart `npm run dev`."
        )
      );
      setIsLoading(false);
      return;
    }

    sanityClient
      .fetch(query, params ?? {})
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result);
        setIsLoading(false);
      })
      .catch((err) => {
        if (id !== requestId.current) return;
        setError(err);
        setIsLoading(false);
      });

    return () => {
      requestId.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey]);

  return { data, error, isLoading };
}
