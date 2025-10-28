import { cx } from 'class-variance-authority'
import Image from 'next/image'

export const CompactTeamHeader = ({
  logo,
  name,
  align = 'left',
}: {
  logo?: string
  name?: string
  align?: 'left' | 'right'
}) => (
  <div className={cx('flex items-center gap-2 mb-1', align === 'right' && 'justify-end')}>
    {logo && (
      <span className="relative w-6 h-6">
        <Image src={logo} alt={name ?? ''} fill sizes="32px" className="object-contain" />
      </span>
    )}
  </div>
)
