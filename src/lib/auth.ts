import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { db } from './db'
import { profiles } from './db/schema'
import { eq } from 'drizzle-orm'
import type { Profile } from './db/schema'

export const ACTIVE_PROFILE_COOKIE = 'active_profile_id'

export async function getCurrentProfile(): Promise<Profile | null> {
  const { userId } = await auth()
  if (!userId) return null

  const cookieStore = await cookies()
  const profileId = cookieStore.get(ACTIVE_PROFILE_COOKIE)?.value
  if (!profileId) return null

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1)

  // Ensure profile belongs to this user
  if (!profile || profile.userId !== userId) return null

  return profile
}
