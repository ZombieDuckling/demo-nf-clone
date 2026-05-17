import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import ProfileForm from '@/components/profiles/profile-form'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ManageProfilesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const userProfiles = await db.select().from(profiles).where(eq(profiles.userId, userId))

  return (
    <div className="min-h-screen bg-background pt-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-white">Manage Profiles</h1>
          <Link href="/profiles">
            <Button variant="outline">Done</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {userProfiles.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-card rounded p-4">
              <span className="text-white font-medium">{p.name}</span>
              <div className="flex gap-2">
                <Link href={`/profiles/${p.id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </div>
            </div>
          ))}
          {userProfiles.length < 5 && <ProfileForm />}
        </div>
      </div>
    </div>
  )
}
