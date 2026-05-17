import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/lib/db'
import { content, contentGenres, genres, seasons, episodes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Plus } from 'lucide-react'
import { formatMinutes } from '@/lib/utils'

export default async function TitlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [item] = await db.select().from(content).where(eq(content.id, id)).limit(1)
  if (!item) notFound()

  const genreRows = await db
    .select({ genre: genres })
    .from(contentGenres)
    .innerJoin(genres, eq(contentGenres.genreId, genres.id))
    .where(eq(contentGenres.contentId, id))

  let seasonData: { id: string; seasonNumber: number; title: string | null; episodes: typeof episodes.$inferSelect[] }[] = []
  if (item.type === 'show') {
    const seasonRows = await db.select().from(seasons).where(eq(seasons.contentId, id))
    seasonData = await Promise.all(
      seasonRows.map(async (s) => ({
        ...s,
        episodes: await db.select().from(episodes).where(eq(episodes.seasonId, s.id)),
      }))
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative w-full h-[60vh]">
        {item.backdropUrl && (
          <Image src={item.backdropUrl} alt={item.title} fill className="object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
      </div>

      <div className="px-6 md:px-12 -mt-40 relative z-10 max-w-4xl">
        <h1 className="text-5xl font-black text-white mb-2">{item.title}</h1>
        <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-300">
          {item.year && <span>{item.year}</span>}
          {item.rating && <Badge variant="outline" className="text-white border-gray-500">{item.rating}</Badge>}
          {item.duration && <span>{formatMinutes(item.duration)}</span>}
          {genreRows.map(({ genre }) => (
            <Link key={genre.id} href={`/browse/genre/${genre.slug}`}>
              <Badge variant="secondary" className="hover:bg-secondary/80">{genre.name}</Badge>
            </Link>
          ))}
        </div>
        <p className="text-gray-300 mb-6 max-w-2xl leading-relaxed">{item.description}</p>
        <div className="flex gap-3 mb-10">
          <Link href={`/watch/${item.id}`}>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-bold gap-2">
              <Play className="w-5 h-5 fill-black" /> Play
            </Button>
          </Link>
          <Button size="lg" variant="secondary" className="gap-2">
            <Plus className="w-5 h-5" /> My List
          </Button>
        </div>

        {seasonData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-semibold">Episodes</h2>
            {seasonData.map((season) => (
              <div key={season.id}>
                <h3 className="text-gray-400 font-medium mb-3">
                  Season {season.seasonNumber}{season.title ? `: ${season.title}` : ''}
                </h3>
                <div className="space-y-3">
                  {season.episodes.map((ep) => (
                    <Link key={ep.id} href={`/watch/${item.id}?episode=${ep.id}`}>
                      <div className="flex gap-4 p-3 rounded hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="relative w-32 aspect-video rounded overflow-hidden bg-gray-800 shrink-0">
                          {ep.thumbnailUrl && (
                            <Image src={ep.thumbnailUrl} alt={ep.title} fill className="object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white/80" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{ep.episodeNumber}. {ep.title}</p>
                          {ep.description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{ep.description}</p>}
                          {ep.duration && <p className="text-gray-500 text-xs mt-1">{formatMinutes(Math.round(ep.duration / 60))}</p>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
