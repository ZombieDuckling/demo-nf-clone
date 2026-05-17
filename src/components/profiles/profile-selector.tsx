'use client'

import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import type { Profile } from '@/lib/db/schema'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500',
  'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500',
]

export default function ProfileSelector({ profiles }: { profiles: Profile[] }) {
  const router = useRouter()

  const selectProfile = async (profile: Profile) => {
    await fetch(`/api/profiles/${profile.id}/select`, { method: 'POST' })
    router.push('/browse')
    router.refresh()
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-light text-white mb-8">Who&apos;s watching?</h1>
      <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
        {profiles.map((profile, i) => (
          <button
            key={profile.id}
            onClick={() => selectProfile(profile)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className={`w-32 h-32 rounded flex items-center justify-center text-5xl font-bold text-white transition-all group-hover:ring-4 group-hover:ring-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
              {profile.name[0].toUpperCase()}
            </div>
            <span className="text-gray-400 group-hover:text-white text-sm transition-colors">
              {profile.name}
            </span>
          </button>
        ))}
        {profiles.length < 5 && (
          <button
            onClick={() => router.push('/profiles/manage')}
            className="flex flex-col items-center gap-3 group"
          >
            <div className="w-32 h-32 rounded border-2 border-gray-600 flex items-center justify-center transition-all group-hover:border-white">
              <Plus className="w-12 h-12 text-gray-600 group-hover:text-white transition-colors" />
            </div>
            <span className="text-gray-400 group-hover:text-white text-sm transition-colors">
              Add Profile
            </span>
          </button>
        )}
      </div>
      <button
        onClick={() => router.push('/profiles/manage')}
        className="mt-10 px-8 py-2 border border-gray-500 text-gray-400 hover:border-white hover:text-white text-sm tracking-widest uppercase transition-colors"
      >
        Manage Profiles
      </button>
    </div>
  )
}
