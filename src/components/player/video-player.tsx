'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Hls from 'hls.js'
import Link from 'next/link'
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

interface VideoPlayerProps {
  contentId: string
  videoId: string | null
  title: string
}

export default function VideoPlayer({ contentId, videoId, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const progressTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (!videoId || !videoRef.current) return

    async function load() {
      const res = await fetch(`/api/stream/${videoId}`)
      const { url } = await res.json()

      const video = videoRef.current!
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().then(() => setPlaying(true)))
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
        video.play().then(() => setPlaying(true))
      }
    }

    load()
  }, [videoId])

  // Save progress every 30s
  useEffect(() => {
    progressTimer.current = setInterval(() => {
      const video = videoRef.current
      if (!video || video.paused) return
      fetch(`/api/watch-history/${contentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          watchedSeconds: Math.floor(video.currentTime),
          completed: video.currentTime / video.duration > 0.9,
        }),
      })
    }, 30000)
    return () => clearInterval(progressTimer.current)
  }, [contentId])

  const hideControls = useCallback(() => {
    clearTimeout(controlsTimer.current)
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000)
  }, [])

  const handleMouseMove = useCallback(() => {
    setShowControls(true)
    hideControls()
  }, [hideControls])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  return (
    <div
      className="relative w-full h-full bg-black cursor-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: showControls ? 'default' : 'none' }}
    >
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          setProgress(v.currentTime)
          setDuration(v.duration || 0)
        }}
        onClick={togglePlay}
      />

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-6 bg-gradient-to-b from-black/50 via-transparent to-black/70 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Top bar */}
        <div className="flex items-center gap-4">
          <Link href="/browse" className="text-white hover:text-gray-300 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="text-white font-semibold text-lg">{title}</span>
        </div>

        {/* Bottom controls */}
        <div className="space-y-3">
          {/* Scrubber */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={progress}
            onChange={(e) => {
              const v = videoRef.current
              if (v) v.currentTime = Number(e.target.value)
              setProgress(Number(e.target.value))
            }}
            className="w-full h-1 accent-[#e50914] cursor-pointer"
          />
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300">
              {playing ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 fill-white" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-gray-300">
              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <span className="text-white text-sm ml-auto">
              {Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2, '0')} /
              {' '}{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
            </span>
            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300">
              {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
