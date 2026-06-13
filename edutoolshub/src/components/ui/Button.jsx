import Link from "next/link";

const variants = {
  primary:
    "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-dark",
  secondary:
    "bg-white text-text border border-border shadow-sm hover:border-primary/40 hover:text-primary",
  accent:
    "bg-accent text-white shadow-md shadow-accent/25 hover:bg-accent-dark",
  ghost: "text-text-muted hover:text-primary hover:bg-primary/5",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !href.startsWith("mailto:") && !href.startsWith("http")) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
