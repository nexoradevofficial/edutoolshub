import { Link } from "react-router-dom";
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

export default function InsightSlide({ post }) {
  if (!post) return null;
  const { title, slug, mainImage, excerpt, publishedAt } = post;
  const href = blogPostHref(slug);
  if (!href) return null;

  const imageSrc = mainImage
    ? urlFor(mainImage).width(800).height(1000).fit("crop").auto("format").url()
    : null;
  const imageSrcSet = mainImage
    ? [
        `${urlFor(mainImage).width(500).height(625).fit("crop").auto("format").url()} 500w`,
        `${urlFor(mainImage).width(800).height(1000).fit("crop").auto("format").url()} 800w`,
        `${urlFor(mainImage).width(1100).height(1375).fit("crop").auto("format").url()} 1100w`,
      ].join(", ")
    : undefined;
  const lqip = mainImage?.asset?.metadata?.lqip;
  const altText = mainImage?.alt || title || "Article cover image";

  return (
    <Link
      to={href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-slate-900 shadow-md transition-shadow duration-300 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      style={lqip ? { backgroundImage: `url(${lqip})`, backgroundSize: "cover" } : undefined}
      draggable={false}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          srcSet={imageSrcSet}
          sizes="(min-width: 1024px) 384px, (min-width: 640px) 45vw, 85vw"
          alt={altText}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <span className="text-xs uppercase tracking-wider">No image</span>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/55 to-slate-900/0"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <div>
          {publishedAt && (
            <time
              dateTime={publishedAt}
              className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white backdrop-blur-sm"
            >
              {formatDate(publishedAt)}
            </time>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold leading-snug text-white drop-shadow-sm sm:text-xl">
            {title}
          </h3>

          {excerpt && (
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-white/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:[transition-delay:150ms]">
                  {excerpt}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <span className="opacity-80 transition-opacity duration-300 group-hover:opacity-100">
              Read article
            </span>
            <IconArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
