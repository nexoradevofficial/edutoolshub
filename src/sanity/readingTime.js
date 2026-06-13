/**
 * Estimate reading time from a Portable Text array.
 * Counts words across all `block` children (skipping inline images / non-text types).
 * Uses 225 wpm as the average adult reading speed.
 */
export function estimateReadingTime(body) {
  if (!Array.isArray(body)) return 1;

  let wordCount = 0;
  for (const block of body) {
    if (block?._type === "block" && Array.isArray(block.children)) {
      for (const child of block.children) {
        if (typeof child?.text === "string") {
          wordCount += child.text.trim().split(/\s+/).filter(Boolean).length;
        }
      }
    }
  }

  return Math.max(1, Math.round(wordCount / 225));
}
