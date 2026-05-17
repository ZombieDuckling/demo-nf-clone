import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { sql, inArray, eq } from 'drizzle-orm'
import ContentCard from '@/components/browse/content-card'
import type { ContentWithGenres } from '@/types/content'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  let results: ContentWithGenres[] = []

  if (q?.trim()) {
    const rows = await db
      .select()
      .from(content)
      .where(sql`${content.searchVector} @@ plainto_tsquery('english', ${q})`)
      .orderBy(sql`ts_rank(${content.searchVector}, plainto_tsquery('english', ${q})) DESC`)
      .limit(20)

    if (rows.length) {
      const ids = rows.map((r) => r.id)
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
      results = rows.map((r) => ({ ...r, genres: genreMap.get(r.id) ?? [] }))
    }
  }

  return (
    <div className="pt-24 px-4 md:px-12 pb-20">
      {q ? (
        <>
          <h1 className="text-white text-2xl font-semibold mb-6">
            {results.length > 0 ? `Results for "${q}"` : `No results for "${q}"`}
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-400 text-lg">Search for movies and TV shows</p>
      )}
    </div>
  )
}
