import { Match } from '@/modules/football/domain/models/fixture'
interface Props {
  match: Match
}

export const TagTime = ({ match }: Props) => {
  const isLive = match.statusConfig?.type === 'live';
  const isScheduled = match.statusConfig?.type === 'scheduled';
  const isFinished = match.status === 'FT';
  
  const minute = parseInt(match.timer || '0');

  let content;
  if (isLive) {
      if (match.status === 'HT') {
          content = <span className="text-[10px] lg:text-sm">DES</span>;
      } else {
          content = <span className="flex items-center justify-center text-[10px] lg:text-sm">{minute}&apos;</span>;
      }
  } else if (isScheduled) {
    content = <span className="text-[10px] lg:text-sm">{match.time}</span>
  } else {
    content = <span className="text-[10px] lg:text-sm">{match.status}</span>
  }

  return (
    <div className={`font-semibold w-6 lg:w-9 text-center`}>
      {isFinished ? <span className="text-[12px] lg:text-sm">- -</span> : content}
    </div>
  )
}