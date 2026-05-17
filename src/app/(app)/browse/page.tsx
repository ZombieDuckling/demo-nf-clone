import { db } from '@/lib/db'
import { content, contentGenres, genres, watchHistory } from '@/lib/db/schema'
import { eq, desc, inArray, and } from 'drizzle-orm'
import HeroBanner from '@/components/browse/hero-banner'
import ContentRow from '@/components/browse/content-row'
import { getCurrentProfile } from '@/lib/auth'

async function getFeatured() {
  const featured = await db.select().from(content)
    .where(eq(content.isFeatured, true)).limit(1)
  return featured[0] ?? null
}

async function getContentWithGenres(limit = 20) {
  const items = await db.select().from(content)
    .orderBy(desc(content.createdAt)).limit(limit)
  if (!items.length) return []
  const ids = items.map((c) => c.id)
  const genreRows = await db
    .select({ contentId: contentGenres.contentId, genre: genres })
    .from(contentGenres)
    .innerJoin(genres, eq(contentGenres.genreId, genres.id))
    .where(inArray(contentGenres.contentId, ids))
  const genreMap = new Map<string, typeof genres.$inferSelect[]>()
  for (const r of genreRows) {
    if (!genreMap.has(r.contentId)) genreMap.set(r.contentId, [])
    genreMap.get(r.contentId)!.push(r.genre)
  }
  return items.map((c) => ({ ...c, genres: genreMap.get(c.id) ?? [] }))
}

export default async function BrowsePage() {
  const [featured, allContent, profile] = await Promise.all([
    getFeatured(),
    getContentWithGenres(),
    getCurrentProfile(),
  ])

  const movies = allContent.filter((c) => c.type === 'movie')
  const shows = allContent.filter((c) => c.type === 'show')

  return (
    <div className="bg-background min-h-screen">
      {featured && <HeroBanner item={featured} />}
      <div className="relative z-10 -mt-32 pb-20 space-y-2">
        <ContentRow title="Trending Now" items={allContent.slice(0, 10)} />
        <ContentRow title="Movies" items={movies} />
        <ContentRow title="TV Shows" items={shows} />
      </div>
    </div>
  )
}
