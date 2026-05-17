import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Info } from 'lucide-react'
import type { Content } from '@/lib/db/schema'

export default function HeroBanner({ item }: { item: Content }) {
  return (
    <div className="relative w-full h-[80vh] min-h-[500px]">
      {item.backdropUrl ? (
        <Image
          src={item.backdropUrl}
          alt={item.title}
          fill
          className="object-cover object-top"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
      )}
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[30%] left-12 max-w-xl space-y-4">
        <h1 className="text-5xl font-black text-white drop-shadow-lg">{item.title}</h1>
        {item.tagline && (
          <p className="text-lg text-gray-200 font-medium">{item.tagline}</p>
        )}
        <p className="text-sm text-gray-300 line-clamp-3">{item.description}</p>
        <div className="flex gap-3">
          <Link href={`/watch/${item.id}`}>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold gap-2">
              <Play className="w-5 h-5 fill-black" /> Play
            </Button>
          </Link>
          <Link href={`/title/${item.id}`}>
            <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white font-bold gap-2 backdrop-blur-sm">
              <Info className="w-5 h-5" /> More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
