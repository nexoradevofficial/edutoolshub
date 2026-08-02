import Link from "next/link";

const sectionClass =
  "rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8";

export default function ToolSeoSection({
  name,
  howToUse,
  faqs,
  relatedTools,
  guideSections = [],
}) {
  return (
    <div className="mt-12 space-y-8 print:hidden">
      {guideSections?.length > 0 &&
        guideSections.map((section) => (
          <section key={section.title} className={sectionClass}>
            <h2 className="text-xl font-semibold text-text sm:text-2xl">{section.title}</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-text sm:text-2xl">
          How to Use {name}
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted sm:text-base">
          {howToUse.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-xl font-semibold text-text sm:text-2xl">
          Frequently Asked Questions
        </h2>
        <div className="mt-5 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-surface-muted/40 open:bg-white"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-text marker:content-none sm:px-5 sm:py-4 sm:text-base [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <span>{faq.question}</span>
                  <span
                    className="mt-0.5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
                    aria-hidden
                  >
                    ▾
                  </span>
                </span>
              </summary>
              <p className="border-t border-border px-4 pb-4 pt-3 text-sm leading-relaxed text-text-muted sm:px-5 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {relatedTools?.length > 0 && (
        <section className={sectionClass}>
          <h2 className="text-xl font-semibold text-text sm:text-2xl">
            Related Tools
          </h2>
          <ul className="mt-4 space-y-3">
            {relatedTools.map((tool) => (
              <li key={tool.path}>
                <Link
                  href={tool.path}
                  className="text-sm font-medium text-primary underline-offset-2 hover:underline sm:text-base"
                >
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
