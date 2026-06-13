import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { escapeHtml } from "./html-escape.js";

const SITE_URL = process.env.SITE_URL || "https://edutoolshub.com";
const libDir = dirname(fileURLToPath(import.meta.url));

let cachedShell = null;

function readAppShell() {
  if (cachedShell) return cachedShell;

  const candidates = [
    join(libDir, "app-shell.html"),
    join(process.cwd(), "server", "lib", "app-shell.html"),
    join(process.cwd(), "dist", "index.html"),
  ];

  for (const path of candidates) {
    if (existsSync(path)) {
      cachedShell = readFileSync(path, "utf-8");
      return cachedShell;
    }
  }

  throw new Error(
    "App shell HTML not found. Run `npm run build` to generate server/lib/app-shell.html."
  );
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

  html = html.replace("</head>", `${headHtml}${bootstrapScript}</head>`);

  html = html.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root">${rootHtml}</div>`
  );

  if (!html.includes(rootHtml.slice(0, 80))) {
    throw new Error(
      "SSR root injection failed: could not find empty <div id=\"root\"></div> in app shell. Run `npm run build` to refresh server/lib/app-shell.html."
    );
  }

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
