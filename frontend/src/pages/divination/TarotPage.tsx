import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CardDeck } from '@/features/tarot/components/CardDeck'
import { InterpretationPanel } from '@/features/tarot/components/InterpretationPanel'
import { SpreadSelector } from '@/features/tarot/components/SpreadSelector'
import { TarotCard } from '@/features/tarot/components/TarotCard'
import { useTarotReading } from '@/features/tarot/hooks/useTarotReading'
import { Compass, Sparkles } from 'lucide-react'

export default function TarotPage() {
  const {
    phase,
    question,
    spread,
    drawnCards,
    interpretation,
    isInterpreting,
    error,
    setQuestion,
    setSpread,
    shuffleAndDraw,
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

  const revealedCount = drawnCards.filter((c) => c.isRevealed).length

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden rounded-3xl glass-card border border-white/5 bg-black/40 shadow-2xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.1),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(212,175,55,0.05),transparent_35%)]" />

      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 md:px-10 py-6 border-b border-white/5 bg-gradient-to-b from-black/60 to-transparent">
        <Link to="/" className="flex items-center gap-3 transition-colors group text-muted-foreground hover:text-amber-300">
          <span className="text-xl group-hover:-translate-x-1 transition-transform font-serif">←</span>
          <span className="tracking-[0.3em] text-xs uppercase font-light">离开圣殿</span>
        </Link>

        <button
          type="button"
          onClick={() => setShowSteps((prev) => !prev)}
          className="md:hidden px-4 py-2 text-xs border rounded-full border-white/10 text-white/70 hover:bg-white/5 transition-colors"
        >
          {showSteps ? '隐藏进度' : '显示进度'}
        </button>

        <div className={`${showSteps ? 'flex' : 'hidden'} md:flex items-center gap-4 md:gap-8`}>
          {steps.map((step, index) => {
            const active = index === currentStepIndex
            const done = index < currentStepIndex
            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    active
                      ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)] scale-125'
                      : done
                        ? 'bg-amber-500/40'
                        : 'bg-white/10'
                  }`}
                />
                <span className={`text-[10px] md:text-xs tracking-[0.2em] uppercase transition-colors duration-500 ${
                  active ? 'text-amber-200 font-medium' : done ? 'text-amber-100/50' : 'text-white/30'
                }`}>
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </header>

      <main className="relative z-10 p-6 md:p-10 min-h-[760px] flex flex-col justify-center items-center">
        {phase === 'question' && (
          <div className="w-full max-w-2xl animate-in fade-in duration-700">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gradient-gold tracking-widest drop-shadow-md">
                你寻求什么？
              </h2>
              <p className="text-muted-foreground/80 text-lg font-light flex justify-center items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary opacity-70" />
                集中精神，让问题在心中浮现
                <Sparkles className="w-4 h-4 text-primary opacity-70" />
              </p>
            </div>

            <div className="tarot-question-frame">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={100}
                placeholder="例如：我在事业上应该采取什么行动？"
                className="tarot-question-surface w-full h-56 px-8 py-8 text-xl resize-none focus:outline-none leading-relaxed text-amber-50 placeholder-white/20 font-serif tracking-wide"
                spellCheck={false}
              />
            </div>

            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => goToPhase('spread')}
                disabled={!question.trim()}
                className="tarot-btn-mystic px-16 py-4 rounded-full tracking-[0.2em] uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                继续
              </button>
            </div>
          </div>
        )}

        {phase === 'spread' && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-gradient-gold tracking-widest mb-4">选择牌阵</h2>
              <p className="text-muted-foreground/70 font-light tracking-widest text-sm uppercase">命运的轨迹已在其中</p>
            </div>
            <SpreadSelector selectedSpread={spread} onSelect={setSpread} />
            <div className="mt-16 flex gap-6">
              <button
                type="button"
                onClick={() => goToPhase('question')}
                className="px-10 py-3 rounded-full transition-colors uppercase tracking-widest text-white/50 hover:text-white/90 hover:bg-white/5"
              >
                返回
              </button>
              <button
                type="button"
                onClick={() => goToPhase('shuffle')}
                className="tarot-btn-mystic px-12 py-3 rounded-full tracking-widest uppercase font-semibold"
              >
                确认牌阵
              </button>
            </div>
          </div>
        )}

        {phase === 'shuffle' && (
          <div className="flex flex-col items-center animate-in fade-in duration-1000">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif mb-6 text-gradient-gold tracking-widest">汇聚你的能量</h2>
              <p className="text-purple-200/60 font-light italic text-lg flex items-center justify-center gap-3">
                <Compass className="w-5 h-5 animate-spin-slow text-amber-500/50" />
                在洗牌时，于心中默念你的问题...
                <Compass className="w-5 h-5 animate-spin-slow text-amber-500/50" />
              </p>
            </div>
            <CardDeck onShuffle={shuffleAndDraw} />
          </div>
        )}

        {(phase === 'draw' || phase === 'reveal') && (
          <div className="flex flex-col items-center w-full animate-in fade-in duration-700">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-serif mb-4 text-gradient-gold tracking-widest drop-shadow-md">
                {phase === 'draw' ? '牌面已现' : '命运揭晓'}
              </h2>
              <div className="text-sm uppercase tracking-[0.25em] text-purple-300/60 font-light flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                {spread.nameCn}
                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
                {question}
                <span className="w-1 h-1 rounded-full bg-amber-500/50" />
              </div>
            </div>

            <div className="relative w-full min-h-[480px] md:min-h-[620px] flex items-center justify-center p-8 md:p-12 rounded-[3rem] border border-white/5 bg-black/30 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.1)_0%,transparent_70%)] pointer-events-none" />
              
              <div className={`flex flex-wrap justify-center items-center gap-12 transition-all duration-1000 ${spread.id === 'celtic-cross' ? 'max-w-5xl' : ''}`}>
                {drawnCards.map((drawn, index) => (
                  <div key={drawn.position.id} className="flex flex-col items-center gap-6 group">
                    <span className="absolute -top-10 text-xs text-amber-200/50 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light">
                      {drawn.position.nameCn}
                    </span>
                    <TarotCard
                      card={drawn.card}
                      isReversed={drawn.isReversed}
                      isRevealed={drawn.isRevealed}
                      onClick={() => {
                        // The user will see cards turned one by one.
                        // Logic handles this automatically or via hook.
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex gap-6 items-center">
              {phase === 'draw' && (
                <button
                  type="button"
                  onClick={() => goToPhase('reveal')}
                  className="px-10 py-4 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-all uppercase tracking-[0.2em] text-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  进入洞察前确认
                </button>
              )}

              {phase === 'reveal' && (
                <>
                  <button
                    type="button"
                    onClick={reset}
                    className="px-8 py-3 transition-colors uppercase tracking-[0.2em] text-white/50 hover:text-white text-sm"
                  >
                    重新开始
                  </button>
                  <button
                    type="button"
                    onClick={startInterpretation}
                    disabled={isInterpreting}
                    className="tarot-btn-mystic px-12 py-4 rounded-full tracking-[0.2em] uppercase font-semibold disabled:opacity-50 text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    {isInterpreting ? '正在聆听神谕...' : '请求神谕'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {phase === 'interpret' && (
          <div className="flex flex-col items-center gap-12 w-full max-w-5xl mx-auto animate-in fade-in duration-1000">
            <div className="flex flex-wrap justify-center gap-6 opacity-95">
              {drawnCards.map((drawn) => (
                <div key={drawn.position.id} className="transform scale-[0.8] origin-top hover:scale-90 transition-transform duration-500">
                  <TarotCard
                    card={drawn.card}
                    isRevealed
                    isReversed={drawn.isReversed}
                    size="sm"
                  />
                  <div className="text-center mt-4 text-xs tracking-widest text-amber-200/60 uppercase">
                    {drawn.position.nameCn}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full">
              <InterpretationPanel interpretation={interpretation} isStreaming={isInterpreting} error={error} />
            </div>

            <div className="flex gap-6 mt-4">
              <button
                type="button"
                onClick={reset}
                className="px-8 py-3 transition-colors uppercase tracking-[0.2em] text-white/50 hover:text-white/90 text-sm"
              >
                再占一次
              </button>
              <button
                type="button"
                onClick={() => goToPhase('reveal')}
                className="px-10 py-3 rounded-full border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all uppercase tracking-[0.2em] text-sm hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]"
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
