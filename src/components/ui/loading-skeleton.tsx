interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded bg-primary/5 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <Skeleton className="mb-3 h-4 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <Skeleton className="mb-4 h-4 w-1/4" />
      <Skeleton className="mb-2 h-48 w-full" />
    </div>
  );
}
