'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProfile } from '@/context/profile-context'
import { UserButton } from '@clerk/nextjs'
import SearchBar from '@/components/search/search-bar'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { profile } = useProfile()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 transition-all duration-300',
        scrolled ? 'bg-background' : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-8">
        <Link href="/browse" className="text-[#e50914] text-2xl font-black tracking-tight select-none">
          NETFLIX
        </Link>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
          <Link href="/browse" className="hover:text-white transition-colors">Home</Link>
          <Link href="/browse/tv" className="hover:text-white transition-colors">TV Shows</Link>
          <Link href="/browse/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link href="/browse/my-list" className="hover:text-white transition-colors">My List</Link>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <SearchBar />
        {profile && (
          <span className="hidden md:block text-sm text-gray-300">{profile.name}</span>
        )}
        <Link href="/profiles" className="text-xs text-gray-400 hover:text-white hidden md:block">
          Switch Profile
        </Link>
        <UserButton />
      </div>
    </nav>
  )
}
