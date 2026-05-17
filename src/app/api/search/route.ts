import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { content, contentGenres, genres } from '@/lib/db/schema'
import { sql, inArray, eq } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q) return NextResponse.json([])

  const results = await db
    .select()
    .from(content)
    .where(sql`${content.searchVector} @@ plainto_tsquery('english', ${q})`)
    .orderBy(sql`ts_rank(${content.searchVector}, plainto_tsquery('english', ${q})) DESC`)
    .limit(20)

  if (!results.length) return NextResponse.json([])

  const ids = results.map((r) => r.id)
  const genreRows = await db
    .select({ contentId: contentGenres.contentId, genre: genres })
    .from(contentGenres)
    .innerJoin(genres, eq(contentGenres.genreId, genres.id))
    .where(inArray(contentGenres.contentId, ids))

  const genreMap = new Map<string, typeof genres.$inferSelect[]>()
  for (const row of genreRows) {
    if (!genreMap.has(row.contentId)) genreMap.set(row.contentId, [])
    genreMap.get(row.contentId)!.push(row.genre)
  }

  return NextResponse.json(results.map((r) => ({ ...r, genres: genreMap.get(r.id) ?? [] })))
}
