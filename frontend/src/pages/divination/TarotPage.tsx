import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CardDeck } from '@/features/tarot/components/CardDeck'
import { InterpretationPanel } from '@/features/tarot/components/InterpretationPanel'
import { SpreadSelector } from '@/features/tarot/components/SpreadSelector'
import { TarotCard } from '@/features/tarot/components/TarotCard'
import { useTarotReading } from '@/features/tarot/hooks/useTarotReading'

export default function TarotPage() {
  const {
    phase,
    question,
    spread,
    drawnCards,
    revealedCount,
    interpretation,
    isInterpreting,
    error,
    setQuestion,
    setSpread,
    shuffleAndDraw,
    revealNextCard,
    revealAllCards,
    startInterpretation,
    reset,
    goToPhase,
  } = useTarotReading()

  const [showSteps, setShowSteps] = useState(true)

  const steps = useMemo(
    () => [
      { id: 'question', label: '提问' },
      { id: 'spread', label: '牌阵' },
      { id: 'shuffle', label: '洗牌' },
      { id: 'draw', label: '揭示' },
      { id: 'interpret', label: '洞察' },
    ],
    []
  )

  const currentStepIndex = useMemo(() => {
    const index = steps.findIndex((step) => step.id === phase)
    return index >= 0 ? index : phase === 'reveal' ? 3 : 0
  }, [phase, steps])

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0B0614]/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.2),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(245,158,11,0.08),transparent_35%)] pointer-events-none" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 md:px-8 py-5 border-b border-white/10 bg-gradient-to-b from-[#0F0518] to-transparent">
        <Link to="/" className="flex items-center gap-3 text-purple-200/80 hover:text-amber-200 transition-colors group">
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="tracking-[0.2em] text-xs md:text-sm uppercase">离开圣殿</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowSteps((prev) => !prev)}
          className="md:hidden px-3 py-1.5 text-xs border border-purple-400/40 rounded-full text-purple-100"
        >
          {showSteps ? '隐藏进度' : '显示进度'}
        </button>

        <div className={`${showSteps ? 'flex' : 'hidden'} md:flex items-center gap-4 md:gap-6`}>
          {steps.map((step, index) => {
            const active = index === currentStepIndex
            const done = index < currentStepIndex
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    active
                      ? 'bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.9)]'
                      : done
                        ? 'bg-amber-500/50'
                        : 'bg-purple-900/60'
                  }`}
                />
                <span className={`text-[10px] md:text-xs tracking-widest uppercase ${active ? 'text-amber-100' : 'text-purple-300/50'}`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </header>

      <main className="relative z-10 p-4 md:p-8 min-h-[760px]">
        {phase === 'question' && (
          <div className="mx-auto max-w-2xl animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-serif text-amber-100 mb-3">你寻求什么？</h2>
              <p className="text-purple-200/60">集中精神，让问题在心中浮现。</p>
            </div>

            <div className="tarot-glass p-1 rounded-2xl">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={100}
                placeholder="例如：我在事业上应该采取什么行动？"
                className="w-full h-48 px-6 py-6 bg-[#0F0518]/80 rounded-xl text-xl text-amber-50 placeholder-purple-500/30 resize-none focus:outline-none leading-relaxed"
              />
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => goToPhase('spread')}
                disabled={!question.trim()}
                className="tarot-btn-mystic px-12 py-4 rounded-full tracking-widest uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                继续
              </button>
            </div>
          </div>
        )}

        {phase === 'spread' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-500">
            <SpreadSelector selectedSpread={spread} onSelect={setSpread} />
            <div className="mt-10 flex gap-4">
              <button
                type="button"
                onClick={() => goToPhase('question')}
                className="px-8 py-3 text-purple-300/60 hover:text-purple-100 transition-colors uppercase tracking-widest"
              >
                返回
              </button>
              <button
                type="button"
                onClick={() => goToPhase('shuffle')}
                className="tarot-btn-mystic px-10 py-3 rounded-full tracking-widest uppercase font-semibold"
              >
                确认牌阵
              </button>
            </div>
          </div>
        )}

        {phase === 'shuffle' && (
          <div className="flex flex-col items-center pt-10 animate-in fade-in duration-700">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-amber-100 mb-3">汇聚你的能量</h2>
              <p className="text-purple-200/60 italic">在洗牌时，于心中默念你的问题...</p>
            </div>
            <CardDeck onShuffle={shuffleAndDraw} />
          </div>
        )}

        {(phase === 'draw' || phase === 'reveal') && (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif text-amber-100 mb-2">{phase === 'draw' ? '牌面已现' : '命运揭晓'}</h2>
              <div className="text-sm text-purple-300/50 uppercase tracking-[0.2em]">{spread.nameCn} • {question}</div>
            </div>

            <div className="relative w-full min-h-[480px] md:min-h-[620px] flex items-center justify-center p-6 md:p-10 rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#1A0B2E]/50 to-transparent backdrop-blur-sm shadow-2xl">
              <div className={`flex flex-wrap justify-center items-center gap-10 transition-all duration-700 ${spread.id === 'celtic-cross' ? 'max-w-5xl' : ''}`}>
                {drawnCards.map((drawn, index) => (
                  <div key={drawn.position.id} className="flex flex-col items-center gap-4 group">
                    <span className="text-xs text-purple-300/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {drawn.position.nameCn}
                    </span>
                    <TarotCard
                      card={drawn.card}
                      isReversed={drawn.isReversed}
                      isRevealed={index < revealedCount}
                      onClick={() => {
                        if (index === revealedCount) {
                          revealNextCard()
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex gap-4 items-center">
              {phase === 'draw' && revealedCount < drawnCards.length && (
                <button
                  type="button"
                  onClick={revealAllCards}
                  className="px-8 py-3 border border-purple-500/30 text-purple-200 rounded-full hover:bg-purple-800/30 transition-all uppercase tracking-widest"
                >
                  全部翻开
                </button>
              )}

              {phase === 'reveal' && (
                <>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-8 py-3 text-purple-300/60 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    重新开始
                  </button>
                  <button
                    type="button"
                    onClick={startInterpretation}
                    disabled={isInterpreting}
                    className="tarot-btn-mystic px-10 py-3 rounded-full tracking-widest uppercase font-semibold disabled:opacity-50"
                  >
                    {isInterpreting ? '正在聆听神谕...' : '请求神谕'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {phase === 'interpret' && (
          <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto animate-in fade-in duration-700">
            <div className="flex flex-wrap justify-center gap-4 opacity-90">
              {drawnCards.map((drawn) => (
                <div key={drawn.position.id} className="transform scale-75 origin-top">
                  <TarotCard card={drawn.card} isRevealed isReversed={drawn.isReversed} size="sm" />
                </div>
              ))}
            </div>

            <InterpretationPanel interpretation={interpretation} isStreaming={isInterpreting} error={error} />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={reset}
                className="px-8 py-3 text-purple-300/70 hover:text-white transition-colors uppercase tracking-widest"
              >
                再占一次
              </button>
              <button
                type="button"
                onClick={() => goToPhase('reveal')}
                className="px-8 py-3 rounded-full border border-amber-400/50 text-amber-200 hover:bg-amber-500/10 transition-colors uppercase tracking-widest"
              >
                返回牌面
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
