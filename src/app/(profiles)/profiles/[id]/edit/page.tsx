import { auth } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import ProfileEditForm from '@/components/profiles/profile-edit-form'

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [profile] = await db.select().from(profiles)
    .where(and(eq(profiles.id, id), eq(profiles.userId, userId))).limit(1)

  if (!profile) notFound()

  return (
    <div className="min-h-screen bg-background pt-20 px-6 md:px-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-8">Edit Profile</h1>
        <ProfileEditForm profile={profile} />
      </div>
    </div>
  )
}
