'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ProfileForm({ profileId }: { profileId?: string }) {
  const [name, setName] = useState('')
  const [isKids, setIsKids] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isKids }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Profile created!')
      router.refresh()
      setName('')
    } catch (err) {
      toast.error('Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded p-4 space-y-4">
      <h3 className="text-white font-medium">Add New Profile</h3>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Profile name"
        required
        className="bg-secondary border-border text-white"
      />
      <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={isKids}
          onChange={(e) => setIsKids(e.target.checked)}
          className="accent-[#e50914]"
        />
        Kids profile
      </label>
      <Button type="submit" disabled={loading} className="bg-[#e50914] hover:bg-[#f40612]">
        {loading ? 'Creating...' : 'Create Profile'}
      </Button>
    </form>
  )
}
