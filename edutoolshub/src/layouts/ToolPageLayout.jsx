import { Link } from "react-router-dom";

const MAX_WIDTH_CLASSES = {
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
  "3xl": "max-w-7xl",
};

export default function ToolPageLayout({
  title,
  description,
  children,
  maxWidth = "lg",
}) {
  const widthClass = MAX_WIDTH_CLASSES[maxWidth] ?? MAX_WIDTH_CLASSES.lg;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface-muted py-6 sm:py-12">
      <div className={`mx-auto ${widthClass} px-4 sm:px-6 lg:px-8`}>
        <Link
          to="/tools"
          className="inline-flex items-center gap-1 text-sm font-medium text-text-muted transition-colors hover:text-primary print:hidden"
        >
          ← Back to tools
        </Link>

        <header className="mb-6 mt-4 print:hidden sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-2 text-sm text-text-muted sm:text-base">{description}</p>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
