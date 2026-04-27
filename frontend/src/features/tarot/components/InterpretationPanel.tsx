interface InterpretationPanelProps {
  interpretation: string
  isStreaming: boolean
  error: string | null
}

export function InterpretationPanel({ interpretation, isStreaming, error }: InterpretationPanelProps) {
  if (error) {
    return (
      <div className="w-full rounded-2xl border border-destructive/30 bg-destructive/10 px-6 py-5 text-destructive">
        {error}
      </div>
    )
  }

  const content = interpretation || '正在连接神谕，请稍候...'

  return (
    <div className="w-full tarot-glass rounded-3xl border border-primary/20 p-8 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      <div className="max-w-none leading-[2.2] text-foreground/90 whitespace-pre-wrap font-serif text-[1.05rem] md:text-lg tracking-[0.05em]">
        {content}
        {isStreaming && <span className="tarot-streaming-cursor" aria-hidden="true" />}
      </div>
    </div>
  )
}
