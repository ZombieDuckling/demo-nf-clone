import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1).max(50),
  isKids: z.boolean().optional(),
  maturityRating: z.enum(['kids', 'teen', 'adult']).optional(),
})

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await db.select().from(profiles).where(eq(profiles.userId, userId))
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await db.select().from(profiles).where(eq(profiles.userId, userId))
  if (existing.length >= 5) {
    return NextResponse.json({ error: 'Maximum 5 profiles allowed' }, { status: 400 })
  }

  const body = createSchema.parse(await req.json())
  const [profile] = await db.insert(profiles).values({
    userId,
    name: body.name,
    isKids: body.isKids ?? false,
    maturityRating: body.maturityRating ?? 'adult',
  }).returning()

  return NextResponse.json(profile, { status: 201 })
}
