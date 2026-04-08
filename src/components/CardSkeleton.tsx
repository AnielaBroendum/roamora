import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl p-4 space-y-3 animate-in fade-in duration-300" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="flex gap-3 items-center">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full" />
          <div className="flex justify-between items-center pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
