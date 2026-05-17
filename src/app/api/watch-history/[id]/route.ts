import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { watchHistory } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentProfile } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  watchedSeconds: z.number().min(0),
  completed: z.boolean().optional(),
  episodeId: z.string().optional(),
})

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: contentId } = await params
  const profile = await getCurrentProfile()
  if (!profile) return NextResponse.json({ error: 'No active profile' }, { status: 401 })

  const body = schema.parse(await req.json())

  const [row] = await db
    .insert(watchHistory)
    .values({
      profileId: profile.id,
      contentId,
      episodeId: body.episodeId,
      watchedSeconds: body.watchedSeconds,
      completed: body.completed ?? false,
      lastWatchedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [watchHistory.profileId, watchHistory.contentId],
      set: {
        watchedSeconds: body.watchedSeconds,
        completed: body.completed ?? false,
        lastWatchedAt: new Date(),
        episodeId: body.episodeId,
      },
    })
    .returning()

  return NextResponse.json(row)
}
