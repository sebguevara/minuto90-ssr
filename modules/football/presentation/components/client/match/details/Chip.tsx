export const Chip = ({ value, max, tone }: { value: number; max: number; tone: 'green' | 'red' }) => {
  const pct = max > 0 ? value / max : 0
  const bg =
    tone === 'green'
      ? `rgba(34,197,94,${0.18 + pct * 0.75})`
      : `rgba(239,68,68,${0.18 + pct * 0.75})`
  return (
    <div
      className="w-[22px] h-[22px] sm:w-6 sm:h-6 rounded-[4px] text-[10px] font-semibold flex items-center justify-center"
      style={{ backgroundColor: bg }}>
      {value || ''}
    </div>
  )
}
