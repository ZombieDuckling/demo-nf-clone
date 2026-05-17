'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ContentCard from './content-card'
import type { ContentWithGenres } from '@/types/content'

export default function ContentRow({
  title,
  items,
}: {
  title: string
  items: ContentWithGenres[]
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 600 : -600, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <div className="px-4 md:px-12 py-4 group/row">
      <h2 className="text-white font-semibold text-lg mb-3">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-black/50 items-center justify-center hidden group-hover/row:flex hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-6"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-black/50 items-center justify-center hidden group-hover/row:flex hover:bg-black/70 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  )
}
