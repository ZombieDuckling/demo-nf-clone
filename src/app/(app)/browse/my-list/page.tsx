import { redirect } from 'next/navigation'
import { getCurrentProfile } from '@/lib/auth'
import { db } from '@/lib/db'
import { myList, content, contentGenres, genres } from '@/lib/db/schema'
import { eq, inArray } from 'drizzle-orm'
import ContentRow from '@/components/browse/content-row'

export default async function MyListPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/profiles')

  const rows = await db
    .select({ content })
    .from(myList)
    .innerJoin(content, eq(myList.contentId, content.id))
    .where(eq(myList.profileId, profile.id))

  const items = rows.map((r) => r.content)
  if (!items.length) {
    return (
      <div className="pt-24 px-12">
        <h1 className="text-white text-3xl font-bold mb-4">My List</h1>
        <p className="text-gray-400">You haven&apos;t added anything yet.</p>
      </div>
    )
  }

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

  return (
    <div className="pt-24 pb-20">
      <h1 className="text-white text-3xl font-bold px-12 mb-6">My List</h1>
      <ContentRow title="" items={items.map((c) => ({ ...c, genres: genreMap.get(c.id) ?? [] }))} />
    </div>
  )
}
