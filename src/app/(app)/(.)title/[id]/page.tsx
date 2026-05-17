import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import TitleModal from '@/components/browse/title-modal'

export default async function TitleInterceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [item] = await db.select().from(content).where(eq(content.id, id)).limit(1)
  if (!item) notFound()

  const genreRows = await db
    .select({ genre: genres })
    .from(contentGenres)
    .innerJoin(genres, eq(contentGenres.genreId, genres.id))
    .where(eq(contentGenres.contentId, id))

  return <TitleModal item={{ ...item, genres: genreRows.map((r) => r.genre) }} />
}
