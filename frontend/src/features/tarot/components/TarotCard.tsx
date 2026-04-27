import { useState } from 'react'
import type { TarotCard as TarotCardType } from '@/features/tarot/types'

interface TarotCardProps {
  card: TarotCardType
  isReversed?: boolean
  isRevealed?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

export function TarotCard({
  card,
  isReversed = false,
  isRevealed = false,
  onClick,
  size = 'md',
}: TarotCardProps) {
  const [imageError, setImageError] = useState(false)

  // Sizes identical to TarotWhisper
  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-48 h-80',
    lg: 'w-64 h-96',
  }

  // Card face needs rotateY(180deg) for 3D flip, plus rotate(180deg) for reversed cards
  const cardFaceTransform = isReversed && isRevealed
    ? 'rotateY(180deg) rotate(180deg)'
    : 'rotateY(180deg)'

  return (
    <div
      className={`relative ${sizeClasses[size]} cursor-pointer tarot-perspective group hover:scale-105 transition-transform duration-500`}
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 tarot-3d shadow-2xl ${
          isRevealed ? 'tarot-rotate-y-180' : ''
        } transition-all ease-out`}
      >
        {/* Card Back - Mystical Design */}
        <div className="absolute w-full h-full tarot-backface rounded-xl overflow-hidden border-2 border-primary/40">
          <div className="w-full h-full bg-card relative overflow-hidden flex items-center justify-center">
             {/* Intricate Border Pattern */}
            <div className="absolute inset-2 border border-primary/40 rounded-lg opacity-80" />
            <div className="absolute inset-3 border border-primary/20 rounded-lg" />
            
            {/* Geometric Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            
            {/* Central Symbol */}
            <div className="relative z-10 flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-500">
              <div className="text-5xl text-primary/80 filter drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                ✦
              </div>
              <div className="mt-2 w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 text-primary/30 text-xl">✨</div>
            <div className="absolute bottom-4 right-4 text-primary/30 text-xl">✨</div>
          </div>
        </div>

        {/* Card Face */}
        <div
          className="absolute w-full h-full tarot-backface rounded-xl overflow-hidden border-2 border-primary/30 bg-card"
          style={{ transform: cardFaceTransform }}
        >
          {!imageError ? (
            <div className="w-full h-full relative">
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              {/* Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Hover Details Inside Card */}
              <div className="absolute bottom-0 w-full p-3 flex flex-col items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                 <h3 className="text-secondary font-serif text-base md:text-lg tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                   {card.nameCn}
                 </h3>
                 
                 {size !== 'sm' && (
                   <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
                     <div className="flex flex-wrap justify-center gap-1 mt-1">
                       {(isReversed ? card.keywords.reversed : card.keywords.upright).slice(0, 3).map((keyword) => (
                         <span
                           key={keyword}
                           className="text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-sm border border-secondary/30 bg-black/50 text-secondary backdrop-blur-sm"
                         >
                           {keyword}
                         </span>
                       ))}
                     </div>
                   </div>
                 )}
              </div>
            </div>
          ) : (
            // Fallback Design
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-card to-background text-center border-4 border-double border-primary/20">
              <div className="text-4xl mb-4 text-primary drop-shadow-lg">
                {card.type === 'major' ? '★' : getSuitSymbol(card.suit)}
              </div>
              <div className="font-serif text-xl font-bold text-foreground mb-1 tracking-widest uppercase border-b border-primary/30 pb-2">
                {card.nameCn}
              </div>
              <div className="text-sm text-muted-foreground/60 font-light tracking-widest uppercase mt-2">
                {card.name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reversed Label - Floating */}
      {isRevealed && isReversed && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-red-500/30 shadow-lg animate-in fade-in zoom-in duration-300 z-10">
           <span className="text-sm text-red-400 font-medium tracking-wide flex items-center gap-1">
             <span className="inline-block transform rotate-180">⇧</span> 逆位
           </span>
        </div>
      )}
    </div>
  )
}

function getSuitSymbol(suit?: string): string {
  switch (suit) {
    case 'wands': return '🪄';
    case 'cups': return '🏆';
    case 'swords': return '⚔️';
    case 'pentacles': return '⭐';
    default: return '✦';
  }
}
