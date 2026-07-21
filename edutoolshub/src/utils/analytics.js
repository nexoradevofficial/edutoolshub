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
  if (typeof window === "undefined") return undefined;

  let timeoutId;
  const interactionEvents = ["pointerdown", "keydown", "touchstart", "scroll"];

  const cleanup = () => {
    window.removeEventListener("load", scheduleFallback);
    interactionEvents.forEach((eventName) => {
      window.removeEventListener(eventName, run);
    });
    if (timeoutId) window.clearTimeout(timeoutId);
  };

  const run = () => {
    cleanup();
    initAnalytics();
  };

  // Keep analytics out of the critical rendering window. Real interactions
  // initialize it immediately; otherwise it starts shortly after page load.
  const scheduleFallback = () => {
    timeoutId = window.setTimeout(run, 4000);
  };

  interactionEvents.forEach((eventName) => {
    window.addEventListener(eventName, run, { once: true, passive: true });
  });

  if (document.readyState === "complete") {
    scheduleFallback();
  } else {
    window.addEventListener("load", scheduleFallback, { once: true });
  }

  return cleanup;
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
