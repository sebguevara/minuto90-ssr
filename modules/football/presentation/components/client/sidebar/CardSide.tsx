'use client'
import Link from 'next/link'
import { generateSlug } from '@/lib/utils'
import { ImageWithRetry } from '@/modules/core/components/Image/ImageWithRetry'
interface Props {
  title: string
  items: {
    text: string
    icon: string
    id: number
  }[]
}

export const CardSide = ({ title, items }: Props) => {
  return (
    <article className="bg-card flex flex-col gap-2 rounded-lg py-2 px-4 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex flex-col gap-2">
        <h2 className="text-primary text-base font-semibold pb-1">{title}</h2>
        <ul className="flex flex-col gap-1">
          {items.map((item, index) => (
            <Link
              key={index}
              href={`/football/liga/${generateSlug(item.text)}/${item.id}`}
              className="text-white-gray flex items-center gap-2">
              <div className="flex items-center justify-center rounded-full p-2">
                <div className="relative w-6 h-6">
                  <ImageWithRetry
                    src={item.icon}
                    alt={item.text}
                    fill
                    sizes="36px"
                    loading="eager"
                    className="object-contain"
                  />
                </div>
              </div>
              <span className="text-sm">
                {item.text.length > 24 ? item.text.slice(0, 24) + '...' : item.text}
              </span>
            </Link>
          ))}
        </ul>
      </div>
    </article>
  )
}
