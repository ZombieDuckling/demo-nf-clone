import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { myList } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getCurrentProfile } from '@/lib/auth'

export async function POST(_req: Request, { params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await params
  const profile = await getCurrentProfile()
  if (!profile) return NextResponse.json({ error: 'No active profile' }, { status: 401 })

  await db
    .insert(myList)
    .values({ profileId: profile.id, contentId })
    .onConflictDoNothing()

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ contentId: string }> }) {
  const { contentId } = await params
  const profile = await getCurrentProfile()
  if (!profile) return NextResponse.json({ error: 'No active profile' }, { status: 401 })

  await db.delete(myList).where(
    and(eq(myList.profileId, profile.id), eq(myList.contentId, contentId))
  )

  return NextResponse.json({ ok: true })
}
