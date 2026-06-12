import { useEffect, useRef, useState } from "react";
import { fetchPostsFromApi, getPostsApiScope } from "./fetchFromApi";
import { sanityClient } from "./client";

/**
 * Fetches Sanity content. Blog queries use `/api/posts` in the browser to
 * avoid CORS blocks from direct Sanity API calls.
 */
export function useSanityQuery(query, params) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const paramsKey = params ? JSON.stringify(params) : "";
  const requestId = useRef(0);
  const apiScope = typeof window !== "undefined" ? getPostsApiScope(query) : null;

  useEffect(() => {
    const id = ++requestId.current;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      if (!import.meta.env.VITE_SANITY_PROJECT_ID) {
        if (!cancelled && id === requestId.current) {
          setError(
            new Error(
              "Sanity is not configured. Set VITE_SANITY_PROJECT_ID in .env.local and restart `npm run dev`."
            )
          );
          setIsLoading(false);
        }
        return;
      }

      try {
        const result =
          apiScope != null
            ? await fetchPostsFromApi(apiScope, params)
            : await sanityClient.fetch(query, params ?? {});

        if (cancelled || id !== requestId.current) return;
        setData(result);
        setIsLoading(false);
      } catch (err) {
        if (cancelled || id !== requestId.current) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
      requestId.current++;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey, apiScope]);

  return { data, error, isLoading };
}
