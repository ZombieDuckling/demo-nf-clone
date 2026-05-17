import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { eq, desc, inArray } from 'drizzle-orm'
import ContentRow from '@/components/browse/content-row'

export default async function MoviesPage() {
  const movies = await db.select().from(content).where(eq(content.type, 'movie')).orderBy(desc(content.createdAt)).limit(40)
  if (!movies.length) return <div className="pt-24 px-12 text-gray-400">No movies found.</div>

  const ids = movies.map((m) => m.id)
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

  const items = movies.map((m) => ({ ...m, genres: genreMap.get(m.id) ?? [] }))

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-white text-3xl font-bold px-12 mb-6">Movies</h1>
      <ContentRow title="All Movies" items={items} />
    </div>
  )
}
