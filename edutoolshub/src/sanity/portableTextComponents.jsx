import { urlFor } from "./image";
import ContentTable from "@/components/blog/ContentTable";

/**
 * Component map passed to @portabletext/react's <PortableText components={...} />.
 *
 * Goals:
 * - Match the site's typography tokens (text, text-muted, primary, border).
 * - Comfortable reading rhythm: clear vertical spacing between blocks,
 *   tight inside lists, generous around headings.
 * - Optimized for a max-w-2xl prose column (~65ch line length).
 * - Accessible: link underlines, external links flagged with rel + new tab,
 *   images always have an alt fallback.
 */

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function getPlainText(children) {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getPlainText).join("");
  if (children?.props?.children) return getPlainText(children.props.children);
  return "";
}

export const portableTextComponents = {
  block: {
    h1: ({ children }) => {
      const id = slugify(getPlainText(children));
      return (
        <h1
          id={id}
          className="scroll-mt-24 text-3xl font-bold tracking-tight text-text sm:text-4xl mt-12 mb-4 first:mt-0"
        >
          {children}
        </h1>
      );
    },
    h2: ({ children }) => {
      const id = slugify(getPlainText(children));
      return (
        <h2
          id={id}
          className="scroll-mt-24 text-2xl font-bold tracking-tight text-text sm:text-3xl mt-12 mb-3 first:mt-0"
        >
          {children}
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = slugify(getPlainText(children));
      return (
        <h3
          id={id}
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-text sm:text-2xl mt-10 mb-2 first:mt-0"
        >
          {children}
        </h3>
      );
    },
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-text mt-8 mb-2 first:mt-0">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-7 border-l-4 border-primary bg-primary/5 px-5 py-4 rounded-r-lg italic text-text">
        <div className="text-base leading-relaxed sm:text-lg">{children}</div>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="my-5 text-base leading-7 text-text sm:leading-8 sm:text-[1.0625rem]">
        {children}
      </p>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="my-5 ml-1 list-outside space-y-2 pl-5 text-base leading-7 text-text marker:text-primary sm:text-[1.0625rem] [&>li]:list-disc">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-5 ml-1 list-outside space-y-2 pl-5 text-base leading-7 text-text marker:font-semibold marker:text-primary sm:text-[1.0625rem] [&>li]:list-decimal">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => (
      <span className="underline underline-offset-2">{children}</span>
    ),
    "strike-through": ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code className="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[0.9em] text-text border border-border">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const openInNewTab = value?.openInNewTab;
      const isExternal =
        /^https?:\/\//i.test(href) &&
        !href.includes("edutoolshub.com");
      const target = openInNewTab || isExternal ? "_blank" : undefined;
      const rel = target === "_blank" ? "noopener noreferrer" : undefined;
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="font-medium text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:text-primary-dark hover:decoration-primary"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset && !value?._computedImage?.src) return null;
      const alt = value.alt || "";
      const caption = value.caption;
      const computed = value._computedImage;
      const src =
        computed?.src ??
        urlFor(value).width(1200).fit("max").auto("format").url();
      const srcSet =
        computed?.srcSet ??
        [
          `${urlFor(value).width(600).fit("max").auto("format").url()} 600w`,
          `${urlFor(value).width(900).fit("max").auto("format").url()} 900w`,
          `${urlFor(value).width(1200).fit("max").auto("format").url()} 1200w`,
          `${urlFor(value).width(1600).fit("max").auto("format").url()} 1600w`,
        ].join(", ");
      const lqip = computed?.lqip ?? value.asset?.metadata?.lqip;

      return (
        <figure className="my-8 sm:my-10">
          <div
            className="overflow-hidden rounded-2xl border border-border bg-surface-muted"
            style={lqip ? { backgroundImage: `url(${lqip})`, backgroundSize: "cover" } : undefined}
          >
            <img
              src={src}
              srcSet={srcSet}
              sizes="(min-width: 768px) 672px, 100vw"
              alt={alt}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 text-center text-sm italic text-text-muted">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
    contentTable: ({ value }) => <ContentTable value={value} />,
  },
};
