'use client';

import { useEffect, useRef, useState } from 'react';

interface MusicOption {
  label: string;
  value: string;
}

const MUSIC_OPTIONS: MusicOption[] = [
  {
    label: '花间',
    value: '/花间.mp3',
  },
  {
    label: 'The Oracle`s Last Card',
    value: '/The_Oracle_s_Last_Card.mp3',
  },
];

const DEFAULT_MUSIC = MUSIC_OPTIONS[0].value;

export function BackgroundMusic(): React.JSX.Element {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(DEFAULT_MUSIC);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.muted = isMuted;

    if (!isMuted) {
      audio.play().catch(() => {
        // 浏览器自动播放策略可能阻止播放，等待用户交互后重试。
      });
    }
  }, [isMuted, selectedMusic]);

  const handleToggleMute = (): void => {
    setIsMuted((previous) => !previous);
  };

  const handleMusicChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedMusic(event.target.value);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={selectedMusic}
        autoPlay
        loop
        preload="auto"
      />

      <div className="fixed top-6 left-6 z-30 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-purple-100/90 backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
        <button
          type="button"
          onClick={handleToggleMute}
          className="rounded-full px-3 py-1 transition-colors duration-300 hover:bg-white/10"
          title={isMuted ? '开启背景音乐' : '关闭背景音乐'}
          aria-label={isMuted ? '开启背景音乐' : '关闭背景音乐'}
        >
          {isMuted ? '🔇 声音关闭' : '🔊 声音开启'}
        </button>

        <label htmlFor="bgm-select" className="sr-only">
          选择背景音乐
        </label>
        <select
          id="bgm-select"
          value={selectedMusic}
          onChange={handleMusicChange}
          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm text-purple-100/90 outline-none transition-colors duration-300 hover:bg-black/30"
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
  );
}
