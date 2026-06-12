import { readFileSync } from "node:fs";
import { join } from "node:path";
import { escapeHtml } from "./html-escape.js";

const SITE_URL = process.env.SITE_URL || "https://edutoolshub.com";

let cachedShell = null;

function readAppShell() {
  if (cachedShell) return cachedShell;
  const indexPath = join(process.cwd(), "dist", "index.html");
  cachedShell = readFileSync(indexPath, "utf-8");
  return cachedShell;
}

/**
 * Build a full HTML document by injecting SSR content and meta into the Vite build shell.
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.rootHtml - HTML placed inside #root for crawlers / no-JS
 * @param {string} [options.headHtml] - Extra tags before </head> (meta, link, json-ld)
 * @param {object} [options.ssrBootstrap] - Serialized to window.__EDUTOOLSHUB_SSR__
 */
export function buildSsrPage({ title, rootHtml, headHtml = "", ssrBootstrap }) {
  let html = readAppShell();

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  const bootstrapScript = ssrBootstrap
    ? `<script>window.__EDUTOOLSHUB_SSR__=${JSON.stringify(ssrBootstrap).replace(/</g, "\\u003c")}</script>`
    : "";

  html = html.replace(
    "</head>",
    `${headHtml}${bootstrapScript}</head>`
  );

  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${rootHtml}</div>`
  );

  return html;
}

export function metaTag(name, content) {
  if (!content) return "";
  return `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}" />`;
}

export function ogTag(property, content) {
  if (!content) return "";
  return `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}" />`;
}

export function linkTag(rel, href) {
  return `<link rel="${escapeHtml(rel)}" href="${escapeHtml(href)}" />`;
}

export { SITE_URL };
