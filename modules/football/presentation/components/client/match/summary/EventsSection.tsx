'use client'

import { MatchEvent, MatchTeam, TeamEvents } from '@/modules/football/domain/models/commentary'
import { ArrowDown, ArrowUp, Square } from 'lucide-react'
import React from 'react'
import Image from 'next/image'
import { formatMinute, groupByPeriod } from '@/modules/football/presentation/utils/summary'

type Props = {
  events: TeamEvents
  teams: MatchTeam[]
  order?: 'desc' | 'asc'
  status: string
}

export const EventsSection: React.FC<Props> = ({ events, teams, order = 'desc', status }) => {
  const periods = groupByPeriod(events.goals.filter((e) => e.comment !== null))
  const periodsOrdered = order === 'desc' ? [...periods].reverse() : periods

  const sortByMinuteDesc = (a: MatchEvent, b: MatchEvent) =>
    Number(b.minute) - Number(a.minute) || (Number(b.extra_min ?? 0) - Number(a.extra_min ?? 0))

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
                const isHome = ev.teamId === teams[0].id
                const key = `${ev.minute}-${ev.extra_min ?? 0}-${i}`
                return <TimelineRow key={key} event={ev} isHome={isHome} teams={teams} />
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
  status: string
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
        </div>
      </div>
    </div>
  )
}

const TimelineRow = ({ event, isHome, teams }: { event: MatchEvent; isHome: boolean; teams: MatchTeam[] }) => {
  const minute = formatMinute({ elapsed: Number(event.minute), extra: Number(event.extra_min ?? 0) })
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-3 px-3 border-b border-gray-300 dark:border-gray-700">
      <div className="text-right">{isHome && <EventBubble event={event} align="right" team={teams[0]} />}</div>
      <div className="text-xs opacity-60">{minute}</div>
      <div className="text-left">{!isHome && <EventBubble event={event} align="left" team={teams[1]} />}</div>
    </div>
  )
}

const EventBubble = ({ event, align, team }: { event: MatchEvent; align: 'left' | 'right'; team: MatchTeam }) => {
  const { name, assist_name, comment, teamId } = event
  return (
    <div
      className={`flex w-full justify-between items-center gap-2 ${
        align === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'
      }`}>
      <TeamLogo teamId={teamId} logo={team.logo!} />
      <div className="flex flex-col w-full">
        <span
          className={`text-xs font-medium flex gap-1 w-full ${
            align === 'right' ? 'justify-start' : 'justify-end'
          }`}>
          {renderTitle(comment)} {iconFor(comment)}
        </span>
        <span
          className={`text-xs flex flex-col w-full text-start font-medium ${
            align === 'right' ? 'items-start' : 'items-end'
          }`}>
          {renderLine(comment, name, assist_name)}
        </span>
      </div>
    </div>
  )
}

const TeamLogo = ({ teamId, logo }: { teamId: string; logo: string | null }) => {
  return (
    <div className="relative w-4 h-4">
      <Image
        src={logo ?? ''}
        alt={teamId}
        className="rounded-sm object-contain"
        fill
        sizes="100%"
      />
    </div>
  )
}

function renderTitle(comment: string | null) {
  if (comment === 'Goal') return '¡GOL!'
  if (comment === 'Card') return 'Tarjeta'
  if (comment === 'Substitution') return 'Cambio'
  if (comment === 'VAR') return 'VAR'
  return comment
}

function renderLine(comment: string | null, player?: string | null, assist?: string | null) {
  if (comment === 'Goal') return <b>{player}</b>
  if (comment === 'Card') return <b>{player}</b>
  if (comment === 'Substitution') return <b>{player}</b>
  if (comment === 'VAR') return <b>{player}</b>
  return <b>{player}</b>
}

function iconFor(comment: string | null) {
  if (comment === 'Goal') return <span>⚽</span>
  if (comment === 'Card') return <CardSquare color="#ccc" />
  if (comment === 'Substitution') return <span className="inline-flex items-center gap-0.5">
    <ArrowUp className="w-3 h-3 text-green-500" />
    <ArrowDown className="w-3 h-3 text-red-500" />
  </span>
  return null
}

const CardSquare = ({ color }: { color: string }) => (
  <Square width={12} height={12} style={{ fill: color, color: 'transparent' }} />
)
