import { useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useGlobalState } from '@/store'

interface BackgroundMusicProps {
  className?: string
}

export function BackgroundMusic({ className }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { isMusicMuted, selectedMusic, toggleMusicMuted } = useGlobalState()

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }
    audio.muted = isMusicMuted
    if (!isMusicMuted) {
      audio.play().catch(() => {
        // autoplay may be blocked before user interaction
      })
    }
  }, [isMusicMuted, selectedMusic])

  return (
    <>
      <audio ref={audioRef} src={selectedMusic} autoPlay loop preload="auto" />
      <button
        type="button"
        onClick={toggleMusicMuted}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary',
          className
        )}
        title={isMusicMuted ? '开启背景音乐' : '关闭背景音乐'}
        aria-label={isMusicMuted ? '开启背景音乐' : '关闭背景音乐'}
      >
        {isMusicMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </button>
    </>
  )
}
