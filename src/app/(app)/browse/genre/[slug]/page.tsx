import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import ContentRow from '@/components/browse/content-row'

export const dynamic = 'force-dynamic'

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [genre] = await db.select().from(genres).where(eq(genres.slug, slug)).limit(1)
  if (!genre) notFound()

  const joins = await db
    .select({ contentId: contentGenres.contentId })
    .from(contentGenres)
    .where(eq(contentGenres.genreId, genre.id))

  const ids = joins.map((j) => j.contentId)
  if (!ids.length) {
    return (
      <div className="pt-24 px-12">
        <h1 className="text-white text-3xl font-bold mb-4">{genre.name}</h1>
        <p className="text-gray-400">No titles in this genre yet.</p>
      </div>
    )
  }

  const items = await db.select().from(content).where(inArray(content.id, ids))
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

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-white text-3xl font-bold px-12 mb-6">{genre.name}</h1>
      <ContentRow title="" items={items.map((c) => ({ ...c, genres: genreMap.get(c.id) ?? [] }))} />
    </div>
  )
}
