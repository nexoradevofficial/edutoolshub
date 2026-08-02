/**
 * Minimal Portable Text helpers for blog rewrite overlays.
 * Keeps content in-repo so AdSense-quality rewrites ship without a Sanity write token.
 */

let _key = 0;
function key() {
  _key += 1;
  return `r${_key.toString(36)}`;
}

function textSpan(text, marks = []) {
  return { _type: "span", _key: key(), text, marks };
}

function linkMark(href) {
  return {
    _type: "link",
    _key: key(),
    href,
    openInNewTab: href.startsWith("http"),
  };
}

/** Build children from mixed string / link tuples: ['text', ['a', href, label], ' more'] */
function childrenFromParts(parts) {
  const children = [];
  const markDefs = [];
  for (const part of parts) {
    if (typeof part === "string") {
      children.push(textSpan(part));
    } else if (Array.isArray(part) && part[0] === "a") {
      const [, href, label] = part;
      const mark = linkMark(href);
      markDefs.push(mark);
      children.push(textSpan(label, [mark._key]));
    }
  }
  if (children.length === 0) children.push(textSpan(""));
  return { children, markDefs };
}

export function blocksFromOutline(outline) {
  _key = 0;
  const blocks = [];

  for (const item of outline) {
    const [type, ...rest] = item;

    if (type === "h2" || type === "h3") {
      const text = rest[0];
      blocks.push({
        _type: "block",
        _key: key(),
        style: type,
        markDefs: [],
        children: [textSpan(text)],
      });
      continue;
    }

    if (type === "p") {
      const parts = rest.length === 1 && typeof rest[0] === "string" ? rest : rest;
      const { children, markDefs } = childrenFromParts(parts);
      blocks.push({
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs,
        children,
      });
      continue;
    }

    if (type === "ul" || type === "ol") {
      const items = rest[0] || [];
      const list = type === "ul" ? "bullet" : "number";
      for (const itemText of items) {
        const parts = typeof itemText === "string" ? [itemText] : itemText;
        const { children, markDefs } = childrenFromParts(parts);
        blocks.push({
          _type: "block",
          _key: key(),
          style: "normal",
          listItem: list,
          level: 1,
          markDefs,
          children,
        });
      }
    }
  }

  return blocks;
}
