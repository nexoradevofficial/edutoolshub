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
