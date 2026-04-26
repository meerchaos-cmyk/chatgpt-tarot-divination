import { useEffect, useRef, useState } from 'react'
import { Music2, Volume2, VolumeX } from 'lucide-react'

import { cn } from '@/lib/utils'

interface MusicOption {
  label: string
  value: string
}

const MUSIC_OPTIONS: MusicOption[] = [
  { label: '花间', value: '/TarotWhisper/public/花间.mp3' },
  { label: 'The Oracle`s Last Card', value: '/TarotWhisper/public/The_Oracle_s_Last_Card.mp3' },
]

const STORAGE_KEY = 'background-music-settings'

interface BackgroundMusicProps {
  className?: string
}

export function BackgroundMusic({ className }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [selectedMusic, setSelectedMusic] = useState(MUSIC_OPTIONS[0].value)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return
      }
      const parsed = JSON.parse(raw) as { isMuted?: boolean; selectedMusic?: string }
      if (typeof parsed.isMuted === 'boolean') {
        setIsMuted(parsed.isMuted)
      }
      if (parsed.selectedMusic && MUSIC_OPTIONS.some((m) => m.value === parsed.selectedMusic)) {
        setSelectedMusic(parsed.selectedMusic)
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isMuted, selectedMusic }))
  }, [isMuted, selectedMusic])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.muted = isMuted
    if (!isMuted) {
      audio.play().catch(() => {
        // autoplay may be blocked before user interaction
      })
    }
  }, [isMuted, selectedMusic])

  return (
    <>
      <audio ref={audioRef} src={selectedMusic} autoPlay loop preload="auto" />
      <div
        className={cn(
          'inline-flex h-10 items-center gap-1 rounded-md border border-border/60 bg-card/70 px-2 text-foreground shadow-sm backdrop-blur-sm',
          className
        )}
      >
        <Music2 className="h-4 w-4 text-primary" />
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          title={isMuted ? '开启背景音乐' : '关闭背景音乐'}
          aria-label={isMuted ? '开启背景音乐' : '关闭背景音乐'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
        <select
          value={selectedMusic}
          onChange={(event) => setSelectedMusic(event.target.value)}
          className="h-8 rounded-md border border-border/70 bg-background/80 px-2 text-xs text-foreground outline-none transition-colors hover:bg-accent/70"
          title="选择背景音乐"
          aria-label="选择背景音乐"
        >
          {MUSIC_OPTIONS.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900 text-purple-100">
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}
