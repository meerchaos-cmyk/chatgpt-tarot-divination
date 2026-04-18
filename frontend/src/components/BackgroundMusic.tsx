import { useEffect, useRef, useState } from 'react'

interface MusicOption {
  label: string
  value: string
}

const MUSIC_OPTIONS: MusicOption[] = [
  { label: '花间', value: '/TarotWhisper/public/花间.mp3' },
  { label: 'The Oracle`s Last Card', value: '/TarotWhisper/public/The_Oracle_s_Last_Card.mp3' },
]

const STORAGE_KEY = 'background-music-settings'

export function BackgroundMusic() {
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
      <div className="fixed top-5 left-5 z-50 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-purple-100/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className="rounded-full px-2 py-1 hover:bg-white/10 transition-colors"
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
        <select
          value={selectedMusic}
          onChange={(event) => setSelectedMusic(event.target.value)}
          className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs outline-none"
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
