import { ScrollArea } from '@/modules/core/components/ui/scroll-area'
import { ScrollBar } from '@/modules/core/components/ui/scroll-area'
import { Chip } from './Chip'

export const CompactStrip = ({
  forTotal,
  agaTotal,
  forArr,
  agaArr,
  maxFor,
  maxAga,
  totalsSide = 'left',
}: {
  forTotal: number
  agaTotal: number
  forArr: number[]
  agaArr: number[]
  maxFor: number
  maxAga: number
  totalsSide?: 'left' | 'right'
}) => {
  const Totals = (
    <div className="flex flex-col items-center justify-center px-1 shrink-0">
      <span className="text-[12px] font-bold text-emerald-500 leading-none">{forTotal}</span>
      <span className="text-[12px] font-bold text-rose-500 leading-none mt-1">{agaTotal}</span>
    </div>
  )

  const Strips = (
    <ScrollArea className="w-full">
      <div className="min-w-max">
        <div className="flex gap-1 mb-[4px]">
          {forArr.map((v, i) => (
            <Chip key={`f-${i}`} value={v} max={maxFor} tone="green" />
          ))}
        </div>
        <div className="flex gap-1">
          {agaArr.map((v, i) => (
            <Chip key={`a-${i}`} value={v} max={maxAga} tone="red" />
          ))}
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )

  return (
    <div className="flex items-center gap-2">
      {totalsSide === 'left' && Totals}
      <div className="flex-1">{Strips}</div>
      {totalsSide === 'right' && Totals}
    </div>
  )
}
