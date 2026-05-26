export default function BlogCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
      aria-hidden="true"
    >
      <div className="aspect-[16/10] w-full animate-pulse bg-surface-muted" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="h-3 w-24 animate-pulse rounded bg-surface-muted" />
        <div className="space-y-2">
          <div className="h-5 w-5/6 animate-pulse rounded bg-surface-muted" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-surface-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-surface-muted" />
        </div>
        <div className="mt-2 h-4 w-28 animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}
