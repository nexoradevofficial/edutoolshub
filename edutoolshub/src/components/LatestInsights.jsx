import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import InsightSlide from "./blog/InsightSlide";
import { useSanityQuery } from "../sanity/useSanityQuery";
import { recentPostsQuery } from "../sanity/queries";

function ChevronIcon({ direction = "right", className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${direction === "left" ? "rotate-180" : ""} ${className}`}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function LatestInsights() {
  const { data: posts, error, isLoading } = useSanityQuery(recentPostsQuery);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", (api) => {
      setScrollSnaps(api.scrollSnapList());
      onSelect(api);
    });
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

  if (error) return null;
  if (!isLoading && (!posts || posts.length === 0)) return null;

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Insights
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Latest Insights
            </h2>
            <p className="mt-3 text-base text-text-muted sm:text-lg">
              Free expert guides on GPA calculations, attendance tracking, exam prep, and
              university admissions—for students and teachers worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/blog"
              className="hidden text-sm font-semibold text-primary transition-colors hover:text-primary-dark sm:inline-flex sm:items-center sm:gap-1"
            >
              View all
              <ChevronIcon />
            </Link>
            <div className="hidden gap-2 sm:flex">
              <CarouselButton
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                ariaLabel="Previous article"
              >
                <ChevronIcon direction="left" />
              </CarouselButton>
              <CarouselButton
                onClick={scrollNext}
                disabled={!canScrollNext}
                ariaLabel="Next article"
              >
                <ChevronIcon />
              </CarouselButton>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <SlidesSkeleton />
          ) : (
            <div
              className="overflow-hidden"
              ref={emblaRef}
              aria-roledescription="carousel"
              aria-label="Latest articles"
            >
              <div className="-ml-4 flex touch-pan-y select-none sm:-ml-5">
                {posts.map((post, i) => (
                  <div
                    key={post._id}
                    className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-[46%] sm:pl-5 lg:basis-[33.333%]"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${posts.length}`}
                  >
                    <InsightSlide post={post} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {scrollSnaps.length > 1 && (
          <div className="mt-8 flex items-center justify-between gap-4 sm:hidden">
            <div className="flex items-center gap-1.5">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === selectedIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-border hover:bg-text-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <CarouselButton
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                ariaLabel="Previous article"
                size="sm"
              >
                <ChevronIcon direction="left" />
              </CarouselButton>
              <CarouselButton
                onClick={scrollNext}
                disabled={!canScrollNext}
                ariaLabel="Next article"
                size="sm"
              >
                <ChevronIcon />
              </CarouselButton>
            </div>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all articles
            <ChevronIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CarouselButton({ onClick, disabled, ariaLabel, children, size = "md" }) {
  const sizing = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex ${sizing} items-center justify-center rounded-full border border-border bg-white text-text shadow-sm transition-all duration-200 hover:border-primary/40 hover:text-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-text disabled:hover:shadow-sm`}
    >
      {children}
    </button>
  );
}

function SlidesSkeleton() {
  return (
    <div className="-ml-4 flex sm:-ml-5" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="min-w-0 shrink-0 grow-0 basis-[85%] pl-4 sm:basis-[46%] sm:pl-5 lg:basis-[33.333%]"
        >
          <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-surface-muted" />
        </div>
      ))}
    </div>
  );
}
