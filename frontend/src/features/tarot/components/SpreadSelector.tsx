import { spreads } from '@/features/tarot/spreads'
import type { Spread } from '@/features/tarot/types'

interface SpreadSelectorProps {
  selectedSpread: Spread
  onSelect: (spread: Spread) => void
}

export function SpreadSelector({ selectedSpread, onSelect }: SpreadSelectorProps) {
  return (
    <div className="w-full max-w-5xl px-4">
      <h3 className="text-2xl font-serif text-primary mb-8 text-center tracking-widest uppercase">
        选择你的牌阵
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {spreads.map((spread) => {
          const isSelected = selectedSpread.id === spread.id
          return (
            <button
              key={spread.id}
              type="button"
              onClick={() => onSelect(spread)}
              className={`
                relative group flex flex-col items-start text-left p-6 rounded-xl transition-all duration-300
                tarot-glass overflow-hidden border
                ${isSelected
                  ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] scale-[1.02]'
                  : 'border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-1 hover:shadow-lg'
                }
              `}
            >
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              )}

              <div className="w-full flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h4 className={`font-serif text-lg tracking-wide transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                    {spread.nameCn}
                  </h4>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider font-light">{spread.name}</span>
                </div>

                <div className={`
                  w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
                  ${isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]'
                    : 'border-primary/20 bg-transparent group-hover:border-secondary/50'
                  }
                `}
                >
                  {isSelected && (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>

              <p className="text-base text-muted-foreground mb-6 font-light leading-relaxed relative z-10">{spread.description}</p>

              <div className="mt-auto relative z-10">
                <span className={`
                  inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium tracking-wide border
                  ${isSelected
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-secondary/10 border-secondary/20 text-muted-foreground'
                  }
                `}
                >
                  {spread.positions.length} 张牌
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
