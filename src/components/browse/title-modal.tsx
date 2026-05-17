'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Plus, X } from 'lucide-react'
import { formatMinutes } from '@/lib/utils'
import type { ContentWithGenres } from '@/types/content'

export default function TitleModal({ item }: { item: ContentWithGenres }) {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border">
        {/* Backdrop */}
        <div className="relative w-full aspect-video">
          {item.backdropUrl ? (
            <Image src={item.backdropUrl} alt={item.title} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <button
            onClick={() => router.back()}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 flex items-center justify-center text-white hover:bg-card transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Link href={`/watch/${item.id}`}>
              <Button size="sm" className="bg-white text-black hover:bg-white/90 font-bold gap-1">
                <Play className="w-4 h-4 fill-black" /> Play
              </Button>
            </Link>
            <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white gap-1">
              <Plus className="w-4 h-4" /> My List
            </Button>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
          <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-400">
            {item.year && <span>{item.year}</span>}
            {item.rating && <Badge variant="outline" className="text-gray-400 border-gray-600">{item.rating}</Badge>}
            {item.duration && <span>{formatMinutes(item.duration)}</span>}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.description}</p>
          <div className="flex flex-wrap gap-1">
            {item.genres.map((g) => (
              <Badge key={g.id} variant="secondary" className="text-xs">{g.name}</Badge>
            ))}
          </div>
          <div className="mt-4">
            <Link href={`/title/${item.id}`} className="text-white/70 hover:text-white text-sm underline">
              More details
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
