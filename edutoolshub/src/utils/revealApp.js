/**
 * Reveal prerendered React markup after styles + hydration are ready.
 * Until then, the inline #app-shell in index.html provides instant FCP/LCP.
 */
export function revealApp() {
  const root = document.getElementById("root");
  root?.classList.add("ready");
  document.getElementById("app-shell")?.remove();
}

function whenMainCssReady() {
  return new Promise((resolve) => {
    const link =
      document.querySelector('link[rel="stylesheet"][href*="/assets/index-"]') ??
      document.querySelector('link[rel="preload"][as="style"][href*="/assets/index-"]');

    if (!link) {
      resolve();
      return;
    }

    if (link.rel === "stylesheet" && link.sheet) {
      resolve();
      return;
    }

    const done = () => resolve();
    link.addEventListener("load", done, { once: true });
    link.addEventListener("error", done, { once: true });

    // Fallback if onload already fired before listeners attached
    setTimeout(done, 3000);
  });
}

export function scheduleAppReveal() {
  Promise.all([
    new Promise((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", resolve, { once: true });
    }),
    whenMainCssReady(),
  ]).then(() => {
    requestAnimationFrame(() => requestAnimationFrame(revealApp));
  });
}
