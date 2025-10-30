import { Skeleton } from "@/modules/core/components/ui/skeleton";

const FiltersSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-2 w-full lg:w-max justify-between">
    {/* Selector de fecha */}
    <div className="flex items-center justify-between gap-2 order-1 md:order-2">
      <Skeleton className="w-full md:w-[140px] h-9 rounded-md" />
    </div>
    
    {/* Botones de filtros */}
    <div className="flex items-center justify-between gap-2 lg:gap-2 mt-1 md:mt-0 order-2 md:order-1">
      <div className="flex items-center gap-2">
        {/* Favoritos y Cuotas */}
        <Skeleton className="w-[75px] h-9 rounded-md" />
        <Skeleton className="w-[65px] h-9 rounded-md" />
      </div>
      <div className="flex items-center gap-2">
        {/* En vivo, Finalizados, Próximos */}
        <Skeleton className="w-[70px] h-9 rounded-md" />
        <Skeleton className="w-[90px] h-9 rounded-md" />
        <Skeleton className="w-[75px] h-9 rounded-md" />
      </div>
    </div>
  </div>
)

export const FixturesSkeleton = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-4 w-full justify-end items-end">
      <FiltersSkeleton />
    </div>
    <div className="flex flex-col gap-4">
  <div className="flex flex-col lg:gap-4">
    <Skeleton className="w-20 h-8 lg:w-42 lg:h-10 rounded-lg" />
  </div>
  {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="flex flex-col gap-4">
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  ))}
</div>
<div className="flex flex-col gap-4 mt-4">
  <div className="flex flex-col lg:gap-4">
    <Skeleton className="w-20 h-8 lg:w-42 lg:h-10 rounded-lg" />
  </div>
  {Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="flex flex-col gap-4">
      <Skeleton className="w-full h-12 rounded-lg" />
    </div>
  ))}
</div>
  </div>
)