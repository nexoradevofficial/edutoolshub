import { useEffect, useRef } from "react";

const GA_MEASUREMENT_ID = "G-XNQCBXCEJL";

/** Load GA4 after the page is interactive so it does not block FCP/LCP. */
export function initAnalytics() {
  if (typeof window === "undefined" || window.__gaInitialized) return;
  window.__gaInitialized = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function scheduleAnalytics() {
  if (typeof window === "undefined") return;

  const run = () => initAnalytics();
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 4000 });
  } else {
    window.addEventListener("load", run, { once: true });
  }
}

export const trackToolUsed = (toolName, toolCategory = "") => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "tool_used", {
      tool_name: toolName,
      tool_category: toolCategory,
    });
  }
};

export const trackBlogRead = (blogTitle, blogUrl) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "blog_read", {
      blog_title: blogTitle,
      blog_url: blogUrl,
    });
  }
};

export const trackGenerateResult = (toolName, resultType = "text") => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "generate_result", {
      tool_name: toolName,
      result_type: resultType,
    });
  }
};

/** Fire generate_result once per visit when a tool first shows output. */
export function useTrackGenerateResult(toolName, isReady, resultType = "text") {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!isReady || trackedRef.current) return;
    trackedRef.current = true;
    trackGenerateResult(toolName, resultType);
  }, [isReady, toolName, resultType]);
}
