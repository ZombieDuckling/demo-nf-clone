'use client'

import { useCallback, useRef } from 'react'

export function useWatchProgress(contentId: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const saveProgress = useCallback(
    (watchedSeconds: number, completed: boolean) => {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        fetch(`/api/watch-history/${contentId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ watchedSeconds, completed }),
        }).catch(() => {})
      }, 500)
    },
    [contentId]
  )

  return { saveProgress }
}
