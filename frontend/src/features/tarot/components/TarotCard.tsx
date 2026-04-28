import { useState } from 'react'
import type { TarotCard as TarotCardType } from '@/features/tarot/types'

interface TarotCardProps {
  card: TarotCardType
  isReversed?: boolean
  isRevealed?: boolean
  /** 翻牌回调（未翻开时点击触发） */
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  /** 牌位名称（如 过去、现在、未来） */
  positionLabel?: string
  /** 是否为选中态（外部控制） */
  isActive?: boolean
  /** 选中态切换回调 */
  onActiveToggle?: () => void
}

export function TarotCard({
  card,
  isReversed = false,
  isRevealed = false,
  onClick,
  size = 'md',
  positionLabel,
  isActive = false,
  onActiveToggle,
}: TarotCardProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-24 h-40',
    md: 'w-48 h-80',
    lg: 'w-64 h-96',
  }

  // Card face needs rotateY(180deg) for 3D flip
  const cardFaceTransform = 'rotateY(180deg)'

  const handleClick = () => {
    if (!isRevealed && onClick) {
      // 未翻开：触发翻牌
      onClick()
    } else if (isRevealed && size !== 'sm' && onActiveToggle) {
      // 已翻开：通知父组件切换选中
      onActiveToggle()
    }
  }

  const isClickable = (!isRevealed && onClick) || (isRevealed && size !== 'sm' && onActiveToggle)

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative ${sizeClasses[size]} ${isClickable ? 'cursor-pointer' : ''} tarot-perspective group`}
        onClick={handleClick}
      >
        {/* 卡牌主体 */}
        <div
          className={`relative w-full h-full transition-transform duration-700 tarot-3d rounded-xl ${
            isRevealed ? 'tarot-rotate-y-180' : ''
          } transition-all ease-out ${!isRevealed && onClick ? 'hover:scale-105' : ''}`}
        >
          {/* Card Back - Mystical Design */}
          <div className="absolute w-full h-full tarot-backface rounded-xl overflow-hidden border-2 border-primary/40 shadow-2xl">
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
            className={`absolute w-full h-full tarot-backface rounded-xl overflow-hidden border-2 bg-card shadow-2xl transition-all duration-500 ${
              isActive
                ? 'border-primary/60 tarot-card-active-glow'
                : 'border-primary/30'
            }`}
            style={{ transform: cardFaceTransform }}
          >
            {!imageError ? (
              <div className="w-full h-full relative">
                <img
                  src={card.image}
                  alt={card.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${isReversed && isRevealed ? 'rotate-180' : ''}`}
                  onError={() => setImageError(true)}
                />
                {/* 底部渐变遮罩 */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isActive
                    ? 'bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-100'
                    : isRevealed
                      ? 'bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100'
                      : 'opacity-0'
                }`} />
                
                {/* 卡牌名称 - 翻牌后始终显示 */}
                {isRevealed && (
                  <div className="absolute bottom-0 w-full p-3 flex flex-col items-center text-center z-10">
                     <h3 className="text-white/95 font-serif text-base md:text-lg tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                       {card.nameCn}
                     </h3>

                     {/* 关键词标签 - 仅选中态显示 */}
                     {isActive && size !== 'sm' && (
                       <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                         <div className="flex flex-wrap justify-center gap-1 mt-1.5">
                           {(isReversed ? card.keywords.reversed : card.keywords.upright).slice(0, 3).map((keyword) => (
                             <span
                               key={keyword}
                               className="text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-sm border border-white/20 bg-black/60 text-white/90 backdrop-blur-sm"
                             >
                               {keyword}
                             </span>
                           ))}
                         </div>

                         {/* 逆位标签 */}
                         {isReversed && (
                           <div className="mt-1.5 bg-black/70 backdrop-blur-md px-3 py-0.5 rounded-full border border-red-500/30 shadow-lg">
                             <span className="text-xs text-red-400 font-medium tracking-wide flex items-center gap-1">
                               <span className="inline-block transform rotate-180">⇧</span> 逆位
                             </span>
                           </div>
                         )}
                       </div>
                     )}

                     {/* 未选中时仅显示逆位小标记 */}
                     {!isActive && isReversed && (
                       <div className="mt-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-500/20">
                         <span className="text-[10px] text-red-400/80 font-medium tracking-wide flex items-center gap-0.5">
                           <span className="inline-block transform rotate-180 text-[8px]">⇧</span> 逆位
                         </span>
                       </div>
                     )}
                  </div>
                )}
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

                {isRevealed && isReversed && (
                  <div className="mt-3 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                    <span className="text-xs text-red-400 font-medium tracking-wide flex items-center gap-1">
                      <span className="inline-block transform rotate-180">⇧</span> 逆位
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 牌位标签 - 卡片下方 */}
      {positionLabel && (
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-3 h-[1px] bg-gradient-to-r from-transparent to-primary/40" />
          <span className="text-[11px] tracking-[0.2em] text-primary/60 font-light uppercase whitespace-nowrap">
            {positionLabel}
          </span>
          <span className="w-3 h-[1px] bg-gradient-to-l from-transparent to-primary/40" />
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
