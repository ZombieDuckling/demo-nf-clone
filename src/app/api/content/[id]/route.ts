import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { content, contentGenres, genres, seasons, episodes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [item] = await db.select().from(content).where(eq(content.id, id)).limit(1)
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const genreRows = await db
    .select({ genre: genres })
    .from(contentGenres)
    .innerJoin(genres, eq(contentGenres.genreId, genres.id))
    .where(eq(contentGenres.contentId, id))

  let seasonData = null
  if (item.type === 'show') {
    const seasonRows = await db.select().from(seasons).where(eq(seasons.contentId, id))
    seasonData = await Promise.all(
      seasonRows.map(async (s) => {
        const eps = await db.select().from(episodes).where(eq(episodes.seasonId, s.id))
        return { ...s, episodes: eps }
      })
    )
  }

  return NextResponse.json({
    ...item,
    genres: genreRows.map((r) => r.genre),
    seasons: seasonData,
  })
}
