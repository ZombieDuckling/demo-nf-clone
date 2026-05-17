'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Profile } from '@/lib/db/schema'

interface ProfileContextValue {
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  setProfile: () => {},
})

export function ProfileProvider({
  children,
  initialProfile,
}: {
  children: React.ReactNode
  initialProfile: Profile | null
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile)

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
