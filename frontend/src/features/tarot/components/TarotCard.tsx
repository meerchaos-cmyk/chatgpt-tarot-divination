import { useState } from 'react'
import type { TarotCard as TarotCardType } from '@/features/tarot/types'

interface TarotCardProps {
  card: TarotCardType
  isReversed?: boolean
  isRevealed?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

const SUIT_SYMBOL: Record<string, string> = {
  wands: '🪄',
  cups: '🏆',
  swords: '⚔️',
  pentacles: '⭐',
}

export function TarotCard({
  card,
  isReversed = false,
  isRevealed = false,
  onClick,
  size = 'md',
}: TarotCardProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-40 h-64 md:w-48 md:h-80',
    lg: 'w-56 h-[22rem] md:w-64 md:h-96',
  }

  const cardFaceTransform = isReversed && isRevealed
    ? 'rotateY(180deg) rotate(180deg)'
    : 'rotateY(180deg)'

  return (
    <button
      type="button"
      className={`relative ${sizeClasses[size]} cursor-pointer tarot-perspective group bg-transparent border-0 p-0`}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 tarot-3d shadow-2xl ${
          isRevealed ? 'tarot-rotate-y-180' : ''
        } group-hover:scale-105 ease-out`}
      >
        <div className="absolute w-full h-full tarot-backface rounded-xl overflow-hidden border-2 border-amber-900/50">
          <div className="w-full h-full bg-[#1a0b2e] relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-2 border border-amber-500/40 rounded-lg opacity-80" />
            <div className="absolute inset-3 border border-amber-500/20 rounded-lg" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
              <div className="text-5xl text-amber-500/80 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">✦</div>
              <div className="mt-2 w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>
            <div className="absolute top-4 left-4 text-amber-500/30 text-xl">✨</div>
            <div className="absolute bottom-4 right-4 text-amber-500/30 text-xl">✨</div>
          </div>
        </div>

        <div
          className="absolute w-full h-full tarot-backface rounded-xl overflow-hidden border-2 border-amber-500/30 bg-[#0f0518]"
          style={{ transform: cardFaceTransform }}
        >
          {!imageError ? (
            <div className="w-full h-full relative">
              <img
                src={card.image}
                alt={card.nameCn}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 w-full p-4 text-center">
                <h3 className="text-amber-100 font-serif text-lg tracking-wider drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.nameCn}
                </h3>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2D1B4E] to-[#0F0518] text-center border-4 border-double border-amber-500/20">
              <div className="text-4xl mb-4 text-amber-400 drop-shadow-lg">
                {card.type === 'major' ? '★' : SUIT_SYMBOL[card.suit ?? ''] ?? '✦'}
              </div>
              <div className="font-serif text-xl font-bold text-amber-100 mb-1 tracking-widest uppercase border-b border-amber-500/30 pb-2">
                {card.nameCn}
              </div>
              <div className="text-sm text-amber-300/60 font-light tracking-widest uppercase mt-2">{card.name}</div>
            </div>
          )}
        </div>
      </div>

      {isRevealed && isReversed && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/30 shadow-lg">
          <span className="text-sm text-red-400 font-medium tracking-wide flex items-center gap-1">
            <span className="inline-block transform rotate-180">⇧</span> 逆位
          </span>
        </div>
      )}
    </button>
  )
}
