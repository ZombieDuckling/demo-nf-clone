import { getCurrentProfile } from '@/lib/auth'
import { ProfileProvider } from '@/context/profile-context'
import Navbar from '@/components/layout/navbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile()

  return (
    <ProfileProvider initialProfile={profile}>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>{children}</main>
      </div>
    </ProfileProvider>
  )
}
