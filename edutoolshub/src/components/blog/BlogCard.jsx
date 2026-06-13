import Link from "next/link";
import { format, parseISO } from "date-fns";
import { urlFor } from "../../sanity/image";
import { blogPostHref } from "../../sanity/normalizeSlug";
import { IconArrowRight } from "../icons/ToolIcons";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return "";
  }
}

export default function BlogCard({ post, priority = false }) {
  if (!post) return null;

  const { title, slug, mainImage, excerpt, publishedAt } = post;
  const href = blogPostHref(slug);
  if (!href) return null;

  const imageSrc = mainImage
    ? urlFor(mainImage).width(800).height(500).fit("crop").auto("format").url()
    : null;
  const imageSrcSet = mainImage
    ? [
        `${urlFor(mainImage).width(400).height(250).fit("crop").auto("format").url()} 400w`,
        `${urlFor(mainImage).width(800).height(500).fit("crop").auto("format").url()} 800w`,
        `${urlFor(mainImage).width(1200).height(750).fit("crop").auto("format").url()} 1200w`,
      ].join(", ")
    : undefined;
  const lqip = mainImage?.asset?.metadata?.lqip;
  const altText = mainImage?.alt || title || "Blog post cover image";

  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted"
        style={lqip ? { backgroundImage: `url(${lqip})`, backgroundSize: "cover" } : undefined}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
            alt={altText}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <span className="text-xs uppercase tracking-wider">No image</span>
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        {publishedAt && (
          <time
            dateTime={publishedAt}
            className="text-xs font-medium uppercase tracking-wider text-text-muted"
          >
            {formatDate(publishedAt)}
          </time>
        )}

        <h3 className="text-xl font-semibold leading-snug tracking-tight text-text transition-colors group-hover:text-primary">
          {title}
        </h3>

        {excerpt && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-text-muted">
            {excerpt}
          </p>
        )}

        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Read article
          <IconArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
