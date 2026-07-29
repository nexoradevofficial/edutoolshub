/**
 * Estimate reading time from a Portable Text array.
 * Counts words across text blocks and contentTable cells (skips images).
 * Uses 225 wpm as the average adult reading speed.
 */
function countWords(text) {
  if (typeof text !== "string") return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(body) {
  if (!Array.isArray(body)) return 1;

  let wordCount = 0;
  for (const block of body) {
    if (block?._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        wordCount += countWords(child?.text);
      }
      continue;
    }

    if (block?._type === "contentTable") {
      if (Array.isArray(block.headers)) {
        for (const header of block.headers) wordCount += countWords(header);
      }
      if (Array.isArray(block.rows)) {
        for (const row of block.rows) {
          if (!Array.isArray(row?.cells)) continue;
          for (const cell of row.cells) wordCount += countWords(cell);
        }
      }
    }
  }

  return Math.max(1, Math.round(wordCount / 225));
}
