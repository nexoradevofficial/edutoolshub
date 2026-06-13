const MODERN_COLOR_RE = /oklab|oklch|color-mix/i;

let colorProbeCanvas;

/** Resolve modern CSS colors to rgba() via a 1×1 canvas pixel read. */
function colorToRgba(colorStr) {
  if (!colorStr || !MODERN_COLOR_RE.test(colorStr)) return colorStr;

  if (!colorProbeCanvas) {
    colorProbeCanvas = document.createElement("canvas");
    colorProbeCanvas.width = 1;
    colorProbeCanvas.height = 1;
  }

  const ctx = colorProbeCanvas.getContext("2d");
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "#000000";
  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
}

function safeStyleValue(prop, value) {
  if (!value || prop.startsWith("--")) return null;
  if (!MODERN_COLOR_RE.test(value)) return value;
  return colorToRgba(value);
}

/**
 * html2canvas cannot parse Tailwind v4 color functions (oklab, oklch).
 * Strip stylesheets from the clone and copy browser-resolved values as
 * inline styles, converting any remaining modern colors to rgba().
 */
export function prepareCloneForHtml2Canvas(sourceRoot, clonedDoc, clonedRoot) {
  clonedDoc.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => {
    node.remove();
  });

  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll("*")];
  const clonedNodes = [clonedRoot, ...clonedRoot.querySelectorAll("*")];

  sourceNodes.forEach((source, index) => {
    const clone = clonedNodes[index];
    if (!clone) return;

    const computed = window.getComputedStyle(source);
    let cssText = "";
    for (let i = 0; i < computed.length; i += 1) {
      const prop = computed[i];
      const raw = computed.getPropertyValue(prop);
      const safe = safeStyleValue(prop, raw);
      if (safe !== null) cssText += `${prop}:${safe};`;
    }
    clone.style.cssText = cssText;
    clone.removeAttribute("class");
  });
}

export async function captureElementAsCanvas(element, options = {}) {
  const html2canvas = (await import("html2canvas")).default;

  return html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
    allowTaint: true,
    ...options,
    onclone: (clonedDoc, clonedEl) => {
      prepareCloneForHtml2Canvas(element, clonedDoc, clonedEl);
      options.onclone?.(clonedDoc, clonedEl);
    },
  });
}
