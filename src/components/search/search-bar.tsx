'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = useCallback((q: string) => {
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`)
    }
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(query)
    if (e.key === 'Escape') { setOpen(false); setQuery('') }
  }

  return (
    <div className="flex items-center gap-2">
      {open ? (
        <div className="flex items-center border border-white/40 bg-black/80 rounded px-3 py-1 gap-2">
          <Search className="w-4 h-4 text-white/70 shrink-0" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Titles, people, genres"
            className="border-0 bg-transparent text-white placeholder:text-white/50 h-7 w-48 focus-visible:ring-0 p-0"
          />
          <button onClick={() => { setOpen(false); setQuery('') }}>
            <X className="w-4 h-4 text-white/70 hover:text-white" />
          </button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="text-white/80 hover:text-white">
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
