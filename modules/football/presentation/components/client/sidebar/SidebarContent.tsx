'use client'
import { RELEVANT_CUP } from '@/lib/consts/football/leagues'
import { CardSide } from './CardSide'
// import { CountriesAccordion } from './CountriesAccordion'
import { useFavoriteStore } from '@/modules/core/store/useFavoriteStore'
import { useMemo } from 'react'
import { League } from '@/modules/football/domain/models/league'

export const SidebarContent = () => {
  const { favoriteLeagues } = useFavoriteStore()

  const destacados = useMemo(() => {
    const favoriteLeagueIds = new Set(Object.values(favoriteLeagues).map((l) => l.id))
    return RELEVANT_CUP.filter((l) => !favoriteLeagueIds.has(l.id.toString()))
  }, [favoriteLeagues])

  return (
    <div className="flex flex-col gap-4 pt-1">
      {destacados.length > 0 && (
        <CardSide
          title="Destacados"
          items={destacados.map((l) => ({ text: l.name, icon: l.logo, id: l.id }))}
        />
      )}

      {Object.values(favoriteLeagues).length > 0 && (
        <>
          <div className="w-full h-0.5 bg-card" />
          <CardSide
            title="Guardados"
            items={Object.values(favoriteLeagues).map((l: League) => ({
              id: Number(l.id),
              text: l.name,
              icon: l.logo ?? '',
            }))}
          />
        </>
      )}

      <div className="w-full h-0.5 bg-card" />
      {/* <CountriesAccordion /> */}
    </div>
  )
}
