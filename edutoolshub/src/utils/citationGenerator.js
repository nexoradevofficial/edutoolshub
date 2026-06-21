function clean(value) {
  return String(value ?? "").trim();
}

function formatAuthorsApa(authors) {
  const list = authors
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return `${list[0]}.`;
  if (list.length === 2) return `${list[0]}, & ${list[1]}.`;
  const last = list.pop();
  return `${list.join(", ")}, & ${last}.`;
}

function formatAuthorsMla(authors) {
  const list = authors
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]}, and ${list[1]}`;
  const last = list.pop();
  return `${list.join(", ")}, and ${last}`;
}

export function generateCitation({ style, sourceType, fields }) {
  const authors = clean(fields.authors);
  const title = clean(fields.title);
  const container = clean(fields.container);
  const publisher = clean(fields.publisher);
  const year = clean(fields.year);
  const url = clean(fields.url);
  const accessDate = clean(fields.accessDate);
  const volume = clean(fields.volume);
  const issue = clean(fields.issue);
  const pages = clean(fields.pages);
  const doi = clean(fields.doi);

  if (!title) {
    return { ok: false, error: "Title is required to generate a citation." };
  }

  if (style === "apa") {
    if (sourceType === "website") {
      if (!authors || !year || !url) {
        return { ok: false, error: "Website citations need author, year, and URL." };
      }
      const line = `${formatAuthorsApa(authors)} (${year}). ${title}. ${container ? `${container}. ` : ""}${url}`;
      return { ok: true, citation: line, inText: `(${formatAuthorsApa(authors).replace(/\.$/, "")}, ${year})` };
    }
    if (sourceType === "book") {
      if (!authors || !publisher || !year) {
        return { ok: false, error: "Book citations need author, publisher, and year." };
      }
      return {
        ok: true,
        citation: `${formatAuthorsApa(authors)} (${year}). ${title}. ${publisher}.`,
        inText: `(${formatAuthorsApa(authors).replace(/\.$/, "")}, ${year})`,
      };
    }
    if (!authors || !year || !container) {
      return { ok: false, error: "Journal citations need author, journal name, and year." };
    }
    const volIssue = [volume ? `${volume}` : "", issue ? `(${issue})` : ""].filter(Boolean).join("");
    const pagePart = pages ? `, ${pages}` : "";
    const doiPart = doi ? ` https://doi.org/${doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")}` : "";
    return {
      ok: true,
      citation: `${formatAuthorsApa(authors)} (${year}). ${title}. ${container}, ${volIssue}${pagePart}.${doiPart}`,
      inText: `(${formatAuthorsApa(authors).replace(/\.$/, "")}, ${year})`,
    };
  }

  if (sourceType === "website") {
    if (!authors || !title || !url) {
      return { ok: false, error: "Website citations need author, title, and URL." };
    }
    const accessed = accessDate ? ` Accessed ${accessDate}.` : "";
    return {
      ok: true,
      citation: `${formatAuthorsMla(authors)}. "${title}." ${container ? `${container}, ` : ""}${year ? `${year}, ` : ""}${url}.${accessed}`,
      inText: `(${formatAuthorsMla(authors)})`,
    };
  }

  if (sourceType === "book") {
    if (!authors || !publisher || !year) {
      return { ok: false, error: "Book citations need author, publisher, and year." };
    }
    return {
      ok: true,
      citation: `${formatAuthorsMla(authors)}. ${title}. ${publisher}, ${year}.`,
      inText: `(${formatAuthorsMla(authors)} ${pages || year})`,
    };
  }

  if (!authors || !container || !year) {
    return { ok: false, error: "Journal citations need author, journal name, and year." };
  }
  const volIssue = volume ? `, vol. ${volume}` : "";
  const issuePart = issue ? `, no. ${issue}` : "";
  const pagePart = pages ? `, pp. ${pages}` : "";
  return {
    ok: true,
    citation: `${formatAuthorsMla(authors)}. "${title}." ${container}, ${year}${volIssue}${issuePart}${pagePart}.`,
    inText: `(${formatAuthorsMla(authors)})`,
  };
}
