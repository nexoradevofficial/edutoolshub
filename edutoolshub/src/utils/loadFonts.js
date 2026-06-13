/** Load Inter after first paint so font CSS does not block FCP/LCP. */
export function scheduleFontLoad() {
  if (typeof window === "undefined") return;

  const run = () => {
    import("@fontsource-variable/inter/wght.css");
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    window.addEventListener("load", run, { once: true });
  }
}
