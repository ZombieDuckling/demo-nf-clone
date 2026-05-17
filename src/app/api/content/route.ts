import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as 'movie' | 'show' | null
  const genreSlug = searchParams.get('genre')
  const featured = searchParams.get('featured') === 'true'
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)

  const conditions = []
  if (type) conditions.push(eq(content.type, type))
  if (featured) conditions.push(eq(content.isFeatured, true))

  let items = await db
    .select()
    .from(content)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(content.createdAt))
    .limit(limit)

  // Attach genres
  if (items.length > 0) {
    const contentIds = items.map((c) => c.id)
    const genreRows = await db
      .select({ contentId: contentGenres.contentId, genre: genres })
      .from(contentGenres)
      .innerJoin(genres, eq(contentGenres.genreId, genres.id))
      .where(inArray(contentGenres.contentId, contentIds))

    const genreMap = new Map<string, typeof genres.$inferSelect[]>()
    for (const row of genreRows) {
      if (!genreMap.has(row.contentId)) genreMap.set(row.contentId, [])
      genreMap.get(row.contentId)!.push(row.genre)
    }

    // Filter by genre if requested
    let filtered = items
    if (genreSlug) {
      filtered = items.filter((c) =>
        genreMap.get(c.id)?.some((g) => g.slug === genreSlug)
      )
    }

    return NextResponse.json(
      filtered.map((c) => ({ ...c, genres: genreMap.get(c.id) ?? [] }))
    )
  }

  return NextResponse.json([])
}
