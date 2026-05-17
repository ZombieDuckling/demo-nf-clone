'use client'

import { useState, useEffect, useCallback } from 'react'

export function useMyList(contentId: string) {
  const [inList, setInList] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/my-list')
      .then((r) => r.json())
      .then((items: { id: string }[]) => {
        setInList(items.some((i) => i.id === contentId))
      })
      .catch(() => {})
  }, [contentId])

  const toggle = useCallback(async () => {
    setInList((prev) => !prev) // optimistic
    setLoading(true)
    try {
      await fetch(`/api/my-list/${contentId}`, {
        method: inList ? 'DELETE' : 'POST',
      })
    } catch {
      setInList((prev) => !prev) // revert on error
    } finally {
      setLoading(false)
    }
  }, [contentId, inList])

  return { inList, toggle, loading }
}
