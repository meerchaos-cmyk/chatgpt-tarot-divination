import { useState } from 'react'

interface CardDeckProps {
  onShuffle: () => void
  isShuffling?: boolean
}

export function CardDeck({ onShuffle, isShuffling = false }: CardDeckProps) {
  const [shuffleAnimation, setShuffleAnimation] = useState(false)

  const handleShuffle = () => {
    setShuffleAnimation(true)
    window.setTimeout(() => {
      setShuffleAnimation(false)
      onShuffle()
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-32 h-48">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`deck-${index}`}
            className={`absolute w-28 h-44 rounded-lg bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 border-2 border-amber-500/50 shadow-lg transition-all duration-300 ${
              shuffleAnimation ? 'tarot-animate-shuffle' : ''
            }`}
            style={{
              top: `${index * 2}px`,
              left: `${index * 2}px`,
              zIndex: 5 - index,
              animationDelay: shuffleAnimation ? `${index * 0.1}s` : '0s',
            }}
          >
            <div className="absolute inset-2 border border-amber-500/30 rounded-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-amber-500/60 text-3xl">✦</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleShuffle}
        disabled={isShuffling || shuffleAnimation}
        className="tarot-btn-mystic px-8 py-3 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium rounded-full transition-all duration-300 disabled:shadow-none"
      >
        {shuffleAnimation ? '洗牌中...' : '洗牌并抽牌'}
      </button>
    </div>
  )
}
