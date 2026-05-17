import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users, subscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { UserProfile } from '@clerk/nextjs'

export default async function AccountPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-background pt-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-white mb-8">Account</h1>
        <UserProfile />
      </div>
    </div>
  )
}
