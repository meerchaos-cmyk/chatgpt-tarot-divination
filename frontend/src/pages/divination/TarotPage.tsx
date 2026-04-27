import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardDeck } from '@/features/tarot/components/CardDeck'
import { InterpretationPanel } from '@/features/tarot/components/InterpretationPanel'
import { SpreadSelector } from '@/features/tarot/components/SpreadSelector'
import { TarotCard } from '@/features/tarot/components/TarotCard'
import { useTarotReading } from '@/features/tarot/hooks/useTarotReading'
import { ArrowLeft, Compass, History, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TarotPage() {
  const navigate = useNavigate()
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
    <div className="space-y-4 md:space-y-6 animate-in fade-in duration-500">
      <Card className="backdrop-blur-lg bg-card/50 dark:bg-card/30 shadow-xl border-primary/10 hover:border-primary/20 transition-all relative overflow-hidden min-h-[600px]">
        {/* 移动端背景图 */}
        <div className="absolute inset-0 md:hidden bg-[url('/TarotWhisper/public/pbg.webp')] bg-cover bg-center pointer-events-none z-0 opacity-30 dark:opacity-60" />
        {/* 装饰光晕 */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(var(--secondary-rgb),0.06),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(var(--primary-rgb),0.04),transparent_35%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(var(--secondary-rgb),0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(var(--primary-rgb),0.08),transparent_45%)] z-0" />

        {/* 返回 & 历史按钮 */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          size="sm"
          className="absolute left-2 top-2 md:left-4 md:top-4 gap-1 text-primary hover:text-primary/80 z-20"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs md:text-sm">返回</span>
        </Button>

        <Button
          onClick={() => navigate('/history/tarot')}
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 md:right-4 md:top-4 gap-1 text-primary hover:text-primary/80 z-20"
        >
          <History className="h-4 w-4" />
          <span className="text-xs md:text-sm">历史</span>
        </Button>

        {/* 标题 & 步骤条 */}
        <CardHeader className="relative z-10 pt-12 pb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent font-serif tracking-widest">
              塔罗牌占卜
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-1">通过塔罗牌探索内心，洞察未来可能性</p>

          {/* 步骤指示器 */}
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowSteps((prev) => !prev)}
              className="md:hidden px-4 py-1.5 text-xs border rounded-full border-border text-muted-foreground hover:bg-muted/50 transition-colors mb-3"
            >
              {showSteps ? '隐藏进度' : '显示进度'}
            </button>
          </div>

          <div className={`${showSteps ? 'flex' : 'hidden'} md:flex items-center justify-center gap-3 md:gap-6`}>
            {steps.map((step, index) => {
              const active = index === currentStepIndex
              const done = index < currentStepIndex
              return (
                <div key={step.id} className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      active
                        ? 'bg-primary shadow-[0_0_10px_rgba(var(--ring),0.6)] scale-125'
                        : done
                          ? 'bg-primary/40'
                          : 'bg-border'
                    }`}
                  />
                  <span className={`text-[10px] md:text-xs tracking-[0.15em] uppercase transition-colors duration-500 ${
                    active ? 'text-primary font-medium' : done ? 'text-primary/50' : 'text-muted-foreground/50'
                  }`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </CardHeader>

        {/* 内容区域 */}
        <CardContent className="relative z-10 px-4 md:px-8 pb-8 min-h-[450px] flex flex-col justify-center items-center">
          {/* ── 提问阶段 ── */}
          {phase === 'question' && (
            <div className="w-full max-w-2xl animate-in fade-in duration-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-serif mb-4 text-gradient-gold tracking-widest">
                  你寻求什么？
                </h3>
                <p className="text-muted-foreground text-base font-light flex justify-center items-center gap-2">
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
                  className="tarot-question-surface w-full h-44 px-6 py-6 text-lg resize-none focus:outline-none leading-relaxed text-foreground placeholder-muted-foreground/40 font-serif tracking-wide"
                  spellCheck={false}
                />
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => goToPhase('spread')}
                  disabled={!question.trim()}
                  className="tarot-btn-mystic px-14 py-3.5 rounded-full tracking-[0.2em] uppercase font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  继续
                </button>
              </div>
            </div>
          )}

          {/* ── 牌阵选择 ── */}
          {phase === 'spread' && (
            <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif text-gradient-gold tracking-widest mb-3">选择牌阵</h3>
                <p className="text-muted-foreground font-light tracking-widest text-sm">命运的轨迹已在其中</p>
              </div>
              <SpreadSelector selectedSpread={spread} onSelect={setSpread} />
              <div className="mt-12 flex gap-4">
                <button
                  type="button"
                  onClick={() => goToPhase('question')}
                  className="px-8 py-2.5 rounded-full transition-colors uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/30 text-sm"
                >
                  返回
                </button>
                <button
                  type="button"
                  onClick={() => goToPhase('shuffle')}
                  className="tarot-btn-mystic px-10 py-2.5 rounded-full tracking-widest uppercase font-semibold"
                >
                  确认牌阵
                </button>
              </div>
            </div>
          )}

          {/* ── 洗牌阶段 ── */}
          {phase === 'shuffle' && (
            <div className="flex flex-col items-center animate-in fade-in duration-1000">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif mb-4 text-gradient-gold tracking-widest">汇聚你的能量</h3>
                <p className="text-muted-foreground font-light italic text-base flex items-center justify-center gap-2">
                  <Compass className="w-4 h-4 animate-spin-slow text-primary/50" />
                  在洗牌时，于心中默念你的问题...
                  <Compass className="w-4 h-4 animate-spin-slow text-primary/50" />
                </p>
              </div>
              <CardDeck onShuffle={shuffleAndDraw} />
            </div>
          )}

          {/* ── 翻牌/揭示 ── */}
          {(phase === 'draw' || phase === 'reveal') && (
            <div className="flex flex-col items-center w-full animate-in fade-in duration-700">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-serif mb-3 text-gradient-gold tracking-widest">
                  {phase === 'draw' ? '牌面已现' : '命运揭晓'}
                </h3>
                <div className="text-sm tracking-[0.15em] text-muted-foreground font-light flex items-center justify-center gap-2 flex-wrap">
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  {spread.nameCn}
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                  <span className="max-w-[200px] truncate">{question}</span>
                  <span className="w-1 h-1 rounded-full bg-primary/50" />
                </div>
              </div>

              <div className="relative w-full min-h-[400px] md:min-h-[520px] flex items-center justify-center p-6 md:p-10 rounded-2xl border border-border/50 bg-card/30 dark:bg-background/20 backdrop-blur-sm shadow-lg overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--secondary-rgb),0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(var(--secondary-rgb),0.1)_0%,transparent_70%)] pointer-events-none" />

                <div className={`flex flex-wrap justify-center items-center gap-8 md:gap-12 transition-all duration-1000 ${spread.id === 'celtic-cross' ? 'max-w-5xl' : ''}`}>
                  {drawnCards.map((drawn, index) => (
                    <div key={drawn.position.id} className="flex flex-col items-center gap-4 group relative">
                      <span className="absolute -top-8 text-xs text-primary/50 uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-light whitespace-nowrap">
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

              <div className="mt-8 flex gap-4 items-center">
                {phase === 'draw' && revealedCount < drawnCards.length && (
                  <button
                    type="button"
                    onClick={revealAllCards}
                    className="px-8 py-3 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-all uppercase tracking-[0.15em] text-sm"
                  >
                    全部翻开
                  </button>
                )}

                {phase === 'reveal' && (
                  <>
                    <button
                      type="button"
                      onClick={reset}
                      className="px-6 py-2.5 transition-colors uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground text-sm"
                    >
                      重新开始
                    </button>
                    <button
                      type="button"
                      onClick={startInterpretation}
                      disabled={isInterpreting}
                      className="tarot-btn-mystic px-10 py-3 rounded-full tracking-[0.15em] uppercase font-semibold disabled:opacity-50 text-sm"
                    >
                      {isInterpreting ? '正在聆听神谕...' : '请求神谕'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── 解读阶段 ── */}
          {phase === 'interpret' && (
            <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto animate-in fade-in duration-1000">
              <div className="flex flex-wrap justify-center gap-4 opacity-95">
                {drawnCards.map((drawn) => (
                  <div key={drawn.position.id} className="transform scale-[0.8] origin-top hover:scale-90 transition-transform duration-500">
                    <TarotCard
                      card={drawn.card}
                      isRevealed
                      isReversed={drawn.isReversed}
                      size="sm"
                    />
                    <div className="text-center mt-3 text-xs tracking-widest text-primary/60 uppercase">
                      {drawn.position.nameCn}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full">
                <InterpretationPanel interpretation={interpretation} isStreaming={isInterpreting} error={error} />
              </div>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-2.5 transition-colors uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground text-sm"
                >
                  再占一次
                </button>
                <button
                  type="button"
                  onClick={() => goToPhase('reveal')}
                  className="px-8 py-2.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all uppercase tracking-[0.15em] text-sm"
                >
                  返回牌面
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
