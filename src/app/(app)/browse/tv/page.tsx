import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import ContentRow from '@/components/browse/content-row'

export default async function TVPage() {
  const shows = await db.select().from(content).where(eq(content.type, 'show')).orderBy(desc(content.createdAt)).limit(40)
  if (!shows.length) return <div className="pt-24 px-12 text-gray-400">No TV shows found.</div>

  const ids = shows.map((s) => s.id)
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

  const items = shows.map((s) => ({ ...s, genres: genreMap.get(s.id) ?? [] }))

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-white text-3xl font-bold px-12 mb-6">TV Shows</h1>
      <ContentRow title="All TV Shows" items={items} />
    </div>
  )
}
