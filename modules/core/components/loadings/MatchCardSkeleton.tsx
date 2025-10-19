import { Skeleton } from '@/modules/core/components/ui/skeleton'

export function MatchCardSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div className="flex w-full items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-6 w-12" />
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Skeleton className="h-4 w-full max-w-[120px]" />
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
        </div>
      </div>
    </div>
  )
}