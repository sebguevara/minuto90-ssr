import { Match } from '@/modules/football/domain/models/fixture'
import { getStatusConfig } from '@/lib/consts/football/match_status'
interface Props {
  match: Match
}

export const TagTime = ({ match }: Props) => {
  const statusConfig = getStatusConfig(match.status);
  const isLive = statusConfig.type === 'live';
  const isScheduled = statusConfig.type === 'scheduled';
  
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
    <div className={`font-semibold ${statusConfig.className}`}>
      {content}
    </div>
  )
}