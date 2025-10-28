import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/modules/core/components/ui/table'
import type { StandingRow } from '@football/domain/entities/Standing'
import { cn } from '@/shared/lib/utils'
import { last5ToArr } from '../../utils/detail'

export const StandingRowCard = ({
  team,
  standing,
}: {
  team: { name: string; logo: string; form?: string }
  standing?: StandingRow | null
}) => {
  const chips = last5ToArr(team.form ?? standing?.form ?? '')

  if (!standing) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
        No hay datos de clasificación disponibles.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="p-2 w-8 text-center whitespace-nowrap">#</TableHead>
            <TableHead className="p-2 whitespace-nowrap">Equipo</TableHead>
            <TableHead className="p-2 text-center whitespace-nowrap">Pts</TableHead>
            <TableHead className="p-2 text-center whitespace-nowrap">PJ</TableHead>
            <TableHead className="p-2 text-center whitespace-nowrap">G</TableHead>
            <TableHead className="p-2 text-center whitespace-nowrap">E</TableHead>
            <TableHead className="p-2 text-center whitespace-nowrap">P</TableHead>
            <TableHead className="p-2 text-center whitespace-nowrap">DG</TableHead>
            <TableHead className="p-2 text-center w-24 whitespace-nowrap">Forma</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="p-2 font-medium text-center whitespace-nowrap">
              {standing.rank}
            </TableCell>
            <TableCell className="p-2 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div className="relative w-5 h-5 flex-shrink-0">
                  <ImageWithRetry
                    src={team.logo}
                    alt={team.name}
                    fill
                    sizes="20px"
                    className="object-contain"
                  />
                </div>
                <span className="font-medium text-xs">{team.name}</span>
              </div>
            </TableCell>
            <TableCell className="p-2 text-center font-bold whitespace-nowrap">
              {standing.points}
            </TableCell>
            <TableCell className="p-2 text-center whitespace-nowrap">
              {standing.all.played}
            </TableCell>
            <TableCell className="p-2 text-center whitespace-nowrap">{standing.all.win}</TableCell>
            <TableCell className="p-2 text-center whitespace-nowrap">{standing.all.draw}</TableCell>
            <TableCell className="p-2 text-center whitespace-nowrap">{standing.all.lose}</TableCell>
            <TableCell className="p-2 text-center whitespace-nowrap">
              {standing.goalsDiff}
            </TableCell>
            <TableCell className="p-2">
              <div className="flex gap-1 justify-center">
                {chips.map((c, i) => (
                  <span
                    key={i}
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-bold',
                      c === 'W'
                        ? 'bg-emerald-500'
                        : c === 'D'
                        ? 'bg-zinc-400 dark:bg-zinc-500'
                        : 'bg-rose-500'
                    )}
                    title={c}>
                    {c}
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
