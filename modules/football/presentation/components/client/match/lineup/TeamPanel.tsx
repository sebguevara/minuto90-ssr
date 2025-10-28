'use client'

import { PlayerUI, SquadUI } from '../../utils/buildSquadUI'
import { Shirt, ArrowRight, ArrowLeft, Square } from 'lucide-react'
import { translatePos } from '../../utils/translatePost'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { generateSlug } from '@/shared/lib/utils'

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0 },
}

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
}

export const TeamPanel = ({ team, flip }: { team: SquadUI; flip?: boolean }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={team.team?.id ?? team.team?.name ?? (flip ? 'away' : 'home')}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={listVariants}
        className="w-full">
        <TeamBlockAnimated
          key={team.team?.id + '-starters'}
          title="TITULARES"
          team={{ starters: team.starters, bench: [], coach: team.coach, team: team.team }}
          flip={flip}
        />
        <TeamBlockAnimated
          key={team.team?.id + '-bench'}
          title="SUPLENTES"
          team={{ starters: team.bench, bench: [], coach: undefined, team: team.team }}
          flip={flip}
        />
      </motion.div>
    </AnimatePresence>
  )
}

const TeamBlockAnimated = ({
  title,
  team,
  flip = false,
}: {
  title: string
  team: SquadUI
  flip?: boolean
}) => {
  return (
    <section className="mb-4">
      <h3 className="bg-card px-3 py-2 font-semibold text-sm tracking-wide">{title}</h3>

      {team.coach && (
        <motion.div key={team.coach.id ?? team.coach.name} variants={itemVariants}>
          <Row
            leftIcon={<RoleBadge label="DT" />}
            name={team.coach.name}
            pos="Dirección"
            rightInfo=""
            key={team.coach.name}
            flip={flip}
          />
        </motion.div>
      )}

      {team.starters.map((p) => (
        <motion.div key={p.id ?? p.name} variants={itemVariants}>
          <Link href={`/football/jugador/${generateSlug(p.name ?? '')}/${p.id}`}>
            <PlayerRow p={p} flip={flip} />
          </Link>
        </motion.div>
      ))}
    </section>
  )
}

const PlayerRow = ({ p, flip }: { p: PlayerUI; flip?: boolean }) => {
  const rightInfo = `${p.height ? p.height + 'm' : ''} ${p.age ? `\n${p.age} años` : ''}`
  return (
    <Row
      leftIcon={<NumberCircle n={p.number} />}
      name={p.name}
      pos={translatePos(p.pos ?? '')}
      rightInfo={rightInfo}
      events={<Events p={p} />}
      flip={flip}
    />
  )
}

const Row = ({
  leftIcon,
  name,
  pos,
  rightInfo,
  events,
  flip,
}: {
  leftIcon: React.ReactNode
  name?: string
  pos: string
  rightInfo?: string
  events?: React.ReactNode
  flip?: boolean
}) => {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 border-b border-border hover:bg-muted/50 transition-colors ${
        flip ? 'flex-row-reverse text-right' : ''
      }`}>
      <div className={`flex items-center gap-3 ${flip ? 'flex-row-reverse' : ''}`}>
        {leftIcon}
        <div className={`flex flex-col leading-tight ${flip ? 'items-end' : ''}`}>
          <span className="font-semibold">{name}</span>
          <span className="text-xs opacity-70">{pos}</span>
        </div>
      </div>

      <div className={`flex items-center gap-3 ${flip ? 'flex-row-reverse' : ''}`}>
        {events}
        {rightInfo && (
          <div className="text-xs opacity-70 whitespace-pre leading-tight">{rightInfo}</div>
        )}
      </div>
    </div>
  )
}
const NumberCircle = ({ n }: { n?: number }) => (
  <div className="relative">
    <Shirt color="transparent" className="w-6 h-6" />
    {typeof n === 'number' && (
      <span className="absolute text-[9px] font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {n}
      </span>
    )}
  </div>
)

const RoleBadge = ({ label }: { label: string }) => (
  <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center text-[10px] font-bold">
    {label}
  </div>
)

const Events = ({ p }: { p: PlayerUI }) => {
  if (p.cards.length === 0 && p.subs.length === 0 && p.goals === 0) return null

  return (
    <div className="flex items-center gap-1 text-xs">
      {p.cards.map((c, i) => (
        <CardIcon key={`c-${i}`} type={c.type} minute={c.minute} />
      ))}

      {p.goals > 0 && Array.from({ length: p.goals }).map((_, i) => <span key={`g-${i}`}>⚽</span>)}

      {p.subs.map((s, i) => (
        <SubIcon key={`s-${i}`} type={s.type} minute={s.minute} />
      ))}
    </div>
  )
}

const CardIcon = ({
  type,
  minute,
}: {
  type: 'yellow' | 'red' | 'second-yellow'
  minute: number
}) => {
  const color =
    type === 'yellow'
      ? '#fdd835'
      : type === 'second-yellow'
      ? 'linear-gradient(#fdd835,#fdd835),linear-gradient(#e53935,#e53935)'
      : '#e53935'
  return (
    <div className="flex items-center gap-0.5">
      <Square
        width={12}
        height={12}
        style={
          type === 'second-yellow'
            ? {
                background: 'linear-gradient(to right,#fdd835 0 50%,#e53935 50% 100%)',
                borderRadius: '2px',
              }
            : { fill: color, color: 'transparent' }
        }
      />
      <span className="text-[10px] opacity-80">{minute}&apos;</span>
    </div>
  )
}

const SubIcon = ({ type, minute }: { type: 'in' | 'out'; minute: number }) => {
  const Icon = type === 'in' ? ArrowRight : ArrowLeft
  return (
    <div className="flex items-center gap-0.5 text-[10px] opacity-80">
      <Icon size={12} />
      {minute}&apos;
    </div>
  )
}
