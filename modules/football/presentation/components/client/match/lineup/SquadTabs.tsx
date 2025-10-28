'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/core/components/ui/tabs'
import { SquadUI } from '../../utils/buildSquadUI'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
import { TeamPanel } from './TeamPanel'
import { abbreviateTeamName } from '@/shared/lib/utils'

export default function SquadTabs({ home, away }: { home: SquadUI; away: SquadUI }) {
  return (
    <Tabs defaultValue="home" className="w-full text-sm">
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="home" className="flex items-center gap-2">
          {home.team?.logo && (
            <div className="relative w-5 h-5 rounded-sm">
              <ImageWithRetry
                src={home.team.logo}
                alt={home.team.name}
                fill
                sizes="100px"
                priority
                className="object-contain"
              />
            </div>
          )}
          {abbreviateTeamName(home.team?.name ?? 'Local')}
        </TabsTrigger>
        <TabsTrigger value="away" className="flex items-center gap-2">
          {away.team?.logo && (
            <div className="relative w-5 h-5 rounded-sm object-contain">
              <ImageWithRetry
                src={away.team.logo}
                alt={away.team.name}
                fill
                sizes="100px"
                priority
                className="object-contain"
              />
            </div>
          )}
          {abbreviateTeamName(away.team?.name ?? 'Visitante')}
        </TabsTrigger>
      </TabsList>

      <div className="mt-2 p-0 md:p-4 border rounded-md">
        <TabsContent value="home">
          <TeamPanel team={home} />
        </TabsContent>

        <TabsContent value="away">
          <TeamPanel team={away} flip />
        </TabsContent>
      </div>
    </Tabs>
  )
}
