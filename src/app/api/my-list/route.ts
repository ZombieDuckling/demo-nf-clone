import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { myList, content } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getCurrentProfile } from '@/lib/auth'

export async function GET() {
  const profile = await getCurrentProfile()
  if (!profile) return NextResponse.json({ error: 'No active profile' }, { status: 401 })

  const rows = await db
    .select({ list: myList, content })
    .from(myList)
    .innerJoin(content, eq(myList.contentId, content.id))
    .where(eq(myList.profileId, profile.id))

  return NextResponse.json(rows.map((r) => r.content))
}
