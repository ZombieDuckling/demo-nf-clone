import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchHistory, content } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { getCurrentProfile } from '@/lib/auth'

export async function GET() {
  const profile = await getCurrentProfile()
  if (!profile) return NextResponse.json({ error: 'No active profile' }, { status: 401 })

  const rows = await db
    .select({ history: watchHistory, content })
    .from(watchHistory)
    .innerJoin(content, eq(watchHistory.contentId, content.id))
    .where(eq(watchHistory.profileId, profile.id))
    .orderBy(desc(watchHistory.lastWatchedAt))
    .limit(20)

  return NextResponse.json(rows.map((r) => ({ ...r.content, progress: r.history })))
}
