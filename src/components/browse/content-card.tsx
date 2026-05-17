'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { ContentWithGenres } from '@/types/content'

export default function ContentCard({ item }: { item: ContentWithGenres }) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()

  return (
    <div
      className="relative shrink-0 w-40 md:w-48 cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/title/${item.id}`}>
        <div className="relative aspect-video rounded overflow-hidden bg-gray-800">
          {item.posterUrl ? (
            <Image src={item.posterUrl} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <span className="text-gray-500 text-xs text-center px-2">{item.title}</span>
            </div>
          )}
        </div>
        {hovered && (
          <div className="absolute inset-x-0 -bottom-20 bg-card border border-border rounded-b shadow-2xl p-2 z-20">
            <p className="text-white text-xs font-semibold truncate mb-1">{item.title}</p>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.preventDefault(); router.push(`/watch/${item.id}`) }}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-200"
              >
                <Play className="w-3 h-3 fill-black text-black" />
              </button>
              <button className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center hover:border-white text-white">
                <Plus className="w-3 h-3" />
              </button>
              <button className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center hover:border-white text-white ml-auto">
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </Link>
    </div>
  )
}
