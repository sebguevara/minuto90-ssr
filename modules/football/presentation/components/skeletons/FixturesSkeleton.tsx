import { Skeleton } from "@/modules/core/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/modules/core/components/ui/card"
import { MatchCardSkeleton } from "@/modules/core/components/loadings/MatchCardSkeleton"

const FiltersSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-2 w-full lg:w-max justify-between">
    <div className="flex items-center justify-between gap-2 order-1 md:order-2">
      <Skeleton className="w-full md:w-[140px] h-9 rounded-md" />
    </div>
    
    <div className="flex items-center justify-between gap-2 lg:gap-2 mt-1 md:mt-0 order-2 md:order-1">
      <div className="flex items-center gap-2">
        <Skeleton className="w-[75px] h-9 rounded-md" />
        <Skeleton className="w-[65px] h-9 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-[70px] h-9 rounded-md" />
        <Skeleton className="w-[90px] h-9 rounded-md" />
        <Skeleton className="w-[75px] h-9 rounded-md" />
      </div>
    </div>
  </div>
)

const SidebarSkeleton = () => (
  <Card className="w-[200px]">
    <CardHeader className="pb-3">
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </CardContent>
  </Card>
)

const LeagueCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </CardContent>
  </Card>
)

export const FixturesContentSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <LeagueCardSkeleton key={i} />
    ))}
  </div>
)

export const FixturesSkeleton = () => (
  <div className="flex flex-col lg:flex-row gap-4">
    <aside className="hidden lg:block w-max shrink-0 sticky top-[90px] self-start">
      <SidebarSkeleton />
    </aside>
    
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-4 w-full justify-end items-end mt-14 lg:mt-0">
        <FiltersSkeleton />
      </div>
      
      <FixturesContentSkeleton />
    </div>
  </div>
)