export default function SiteLogo({
  className = "h-9 w-9 shrink-0 rounded-xl object-contain",
  width = 36,
  height = 36,
  priority = false,
}) {
  const webpSrc = width <= 36 ? "/logo-36.webp" : "/logo-72.webp";

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={webpSrc}
        alt="EduToolsHub logo"
        width={width}
        height={height}
        className={className}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
      />
    </picture>
  );
}
