'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { Profile } from '@/lib/db/schema'

export default function ProfileEditForm({ profile }: { profile: Profile }) {
  const [name, setName] = useState(profile.name)
  const [isKids, setIsKids] = useState(profile.isKids)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isKids }),
      })
      if (!res.ok) throw new Error()
      toast.success('Profile updated!')
      router.push('/profiles/manage')
      router.refresh()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this profile?')) return
    await fetch(`/api/profiles/${profile.id}`, { method: 'DELETE' })
    toast.success('Profile deleted')
    router.push('/profiles/manage')
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Profile name"
        required
        className="bg-secondary border-border text-white"
      />
      <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
        <input type="checkbox" checked={isKids} onChange={(e) => setIsKids(e.target.checked)} className="accent-[#e50914]" />
        Kids profile
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="bg-[#e50914] hover:bg-[#f40612]">
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="button" variant="destructive" onClick={handleDelete} className="ml-auto">
          Delete Profile
        </Button>
      </div>
    </form>
  )
}
