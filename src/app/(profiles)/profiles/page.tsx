import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import ProfileSelector from '@/components/profiles/profile-selector'

export default async function ProfilesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const userProfiles = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ProfileSelector profiles={userProfiles} />
    </div>
  )
}
