"use client";

/**
 * Crawlable SEO content — keyword-rich copy for search engines.
 * Rendered in the DOM (not only in meta tags).
 */
export default function SaasSeoContent({ product }) {
  const seo = product.seo || {};
  const modules = product.modules || [];

  return (
    <section
      aria-label={`${product.title} overview for search`}
      className="border-t border-slate-100 bg-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-saas-ink sm:text-3xl">
          {seo.h2 || `About ${product.title}`}
        </h2>
        {(seo.paragraphs || [product.description]).map((p) => (
          <p key={p.slice(0, 48)} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            {p}
          </p>
        ))}

        {seo.secondaryHeading && (
          <h3 className="mt-10 text-xl font-semibold text-saas-ink">{seo.secondaryHeading}</h3>
        )}
        {seo.secondaryParagraphs?.map((p) => (
          <p key={p.slice(0, 48)} className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {p}
          </p>
        ))}

        <h3 className="mt-10 text-xl font-semibold text-saas-ink">
          {seo.modulesHeading || "Key modules included"}
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {modules.map((mod) => (
            <li key={mod.id} className="text-sm text-slate-600">
              <span className="font-medium text-saas-ink">{mod.title}</span>
              {mod.description ? ` — ${mod.description}` : null}
            </li>
          ))}
        </ul>

        {seo.closing && (
          <p className="mt-8 text-sm leading-relaxed text-slate-600 sm:text-base">{seo.closing}</p>
        )}
      </div>
    </section>
  );
}
