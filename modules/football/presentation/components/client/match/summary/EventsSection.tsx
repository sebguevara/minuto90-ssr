'use client'

import { MatchEvent, MatchPreviewStatus } from '@football/domain/entities/Match'
import { ArrowDown, ArrowUp, Square } from 'lucide-react'
import React from 'react'
import { Team } from '@football/domain/entities/Team'
import Image from 'next/image'
import { formatMinute, groupByPeriod } from '../../utils/summary'

type Props = {
  events: MatchEvent[]
  homeTeamId: number
  order?: 'desc' | 'asc'
  status: MatchPreviewStatus
}

export const EventsSection: React.FC<Props> = ({ events, homeTeamId, order = 'desc', status }) => {
  const periods = groupByPeriod(events)
  const periodsOrdered = order === 'desc' ? [...periods].reverse() : periods

  const sortByMinuteDesc = (a: MatchEvent, b: MatchEvent) =>
    (b.time?.elapsed ?? 0) + (b.time?.extra ?? 0) - ((a.time?.elapsed ?? 0) + (a.time?.extra ?? 0))

  const hasTwoHalves = periods.length >= 2

  return (
    <section className="mt-4 pb-2">
      <h2 className="text-sm font-semibold">Eventos del Partido</h2>

      <div className="flex flex-col gap-y-4 mt-2">
        {order === 'desc' && <DividerMarker kind="fulltime" status={status} />}

        {periodsOrdered.map(({ label, events }, idx) => (
          <div key={label} className="rounded-md border border-border bg-card shadow-sm">
            <PeriodHeader label={label} />
            <div>
              {[...events].sort(sortByMinuteDesc).map((ev, i) => {
                const isHome = ev.team.id === homeTeamId
                const key = `${ev.time.elapsed}-${ev.time.extra ?? 0}-${i}`
                return <TimelineRow key={key} event={ev} isHome={isHome} />
              })}
            </div>
            {order === 'desc' && hasTwoHalves && idx === 0 && (
              <DividerMarker kind="halftime" status={status} />
            )}
          </div>
        ))}
        {order === 'desc' && <DividerMarker kind="kickoff" status={status} />}
      </div>
    </section>
  )
}

const PeriodHeader = ({ label }: { label: string }) => (
  <div className="text-xs uppercase tracking-wider font-semibold px-3 py-2 bg-muted/40">
    {label === 'ET / Penales' ? 'Tiempo Extra' : label}
  </div>
)

const DividerMarker = ({
  kind,
  status,
}: {
  kind: 'kickoff' | 'halftime' | 'fulltime'
  status: MatchPreviewStatus
}) => {
  const map = {
    kickoff: { text: 'Inicio del partido' },
    halftime: { text: 'Entretiempo' },
    fulltime: { text: 'Final del partido' },
  } as const
  const { text } = map[kind]

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <div
        className={`col-span-3 flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-muted/40 ${
          text === 'Final del partido'
            ? 'rounded-t-md'
            : text === 'Inicio del partido'
            ? 'rounded-b-md'
            : 'rounded-b-md mt-4'
        }`}>
        <div>
          <span className="text-xs text-muted-foreground">{text}</span>
          {status?.extra && text === 'Final del partido' && (
            <span className="text-xs text-muted-foreground">
              - {status?.elapsed}&apos; +{status?.extra}&apos;
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

const TimelineRow = ({ event, isHome }: { event: MatchEvent; isHome: boolean }) => {
  const minute = formatMinute(event.time)
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 px-3 border-b border-gray-300 dark:border-gray-700">
      <div className="text-right">{isHome && <EventBubble event={event} align="right" />}</div>
      <div className="text-xs opacity-60">{minute}</div>
      <div className="text-left">{!isHome && <EventBubble event={event} align="left" />}</div>
    </div>
  )
}

const EventBubble = ({ event, align }: { event: MatchEvent; align: 'left' | 'right' }) => {
  const { player, assist, type, detail, team } = event
  return (
    <div
      className={`flex w-full justify-between items-center gap-2 ${
        align === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'
      }`}>
      <TeamLogo team={team} />
      <div className="flex flex-col w-full">
        <span
          className={`text-xs font-medium flex gap-1 w-full ${
            align === 'right' ? 'justify-start' : 'justify-end'
          }`}>
          {renderTitle(type, detail)} {iconFor(type, detail)}
        </span>
        <span
          className={`text-xs flex flex-col w-full text-start font-medium ${
            align === 'right' ? 'items-start' : 'items-end'
          }`}>
          {renderLine(type, detail, player?.name, assist?.name)}
        </span>
      </div>
    </div>
  )
}

const TeamLogo = ({ team }: { team: Team }) => {
  if (!team?.logo) return null
  return (
    <div className="relative w-4 h-4">
      <Image
        src={team.logo}
        alt={team.name}
        className="rounded-sm object-contain"
        fill
        sizes="100%"
      />
    </div>
  )
}

function renderTitle(type: string, detail?: string) {
  const d = (detail || '').toLowerCase()
  if (type === 'Goal') {
    if (detail === 'Missed Penalty') return '¡Penal Fallado!'
    if (d.includes('pen')) return '¡GOL (penal)!'
    if (d.includes('own')) return '¡Autogol!'
    return '¡GOL!'
  }
  if (type === 'Card') {
    if (d.includes('yellow')) return 'Tarjeta Amarilla'
    if (d.includes('red')) return 'Tarjeta Roja'
    return 'Tarjeta'
  }
  if (type === 'subst' || type.toLowerCase() === 'substitution') return 'Cambio'
  if (type.toLowerCase() === 'var') {
    switch (detail) {
      case 'Goal cancelled':
        return 'VAR: ¡Gol Anulado!'
      case 'Goal confirmed':
        return 'VAR: ¡Gol Confirmado!'
      case 'Penalty confirmed':
        return 'VAR: ¡Penal Confirmado!'
      case 'Penalty cancelled':
        return 'VAR: ¡Penal Anulado!'
      case 'Card upgraded':
        return 'VAR: Tarjeta Mejorada'
      case 'Card downgraded':
        return 'VAR: Tarjeta Disminuida'
      default:
        return 'VAR'
    }
  }
  return type
}

function renderLine(type: string, detail?: string, player?: string | null, assist?: string | null) {
  if (type === 'Goal' && detail === 'Missed Penalty') return <b>{player}</b>
  if (type === 'subst' || type.toLowerCase() === 'substitution') {
    return (
      <>
        <b>{player}</b> por {assist ?? '—'}
      </>
    )
  }
  if (type === 'Goal') {
    return (
      <>
        <b>{player}</b>
        {assist ? <span className="opacity-70 text-[11px]"> (asist. {assist})</span> : null}
      </>
    )
  }
  return <b>{player}</b>
}

function iconFor(type: string, detail?: string) {
  if (type === 'Goal') return <span>⚽</span>
  if (type === 'Card') {
    const d = (detail || '').toLowerCase()
    if (d.includes('yellow')) return <CardSquare color="#fdd835" />
    if (d.includes('red')) return <CardSquare color="#e53935" />
    return <CardSquare color="#ccc" />
  }
  if (type === 'subst' || type.toLowerCase() === 'substitution') {
    return (
      <span className="inline-flex items-center gap-0.5">
        <ArrowUp className="w-3 h-3 text-green-500" />
        <ArrowDown className="w-3 h-3 text-red-500" />
      </span>
    )
  }
  return null
}

const CardSquare = ({ color }: { color: string }) => (
  <Square width={12} height={12} style={{ fill: color, color: 'transparent' }} />
)
