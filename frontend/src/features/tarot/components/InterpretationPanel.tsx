interface InterpretationPanelProps {
  interpretation: string
  isStreaming: boolean
  error: string | null
}

export function InterpretationPanel({ interpretation, isStreaming, error }: InterpretationPanelProps) {
  if (error) {
    return (
      <div className="w-full rounded-2xl border border-red-500/30 bg-red-900/20 px-6 py-5 text-red-100">
        {error}
      </div>
    )
  }

  const content = interpretation || '正在连接神谕，请稍候...'

  return (
    <div className="w-full tarot-glass rounded-2xl border border-purple-500/20 p-6 md:p-8">
      <div className="max-w-none leading-7 text-purple-50/90 whitespace-pre-wrap">
        {content}
      </div>
      {isStreaming && <span className="tarot-streaming-cursor" aria-hidden="true" />}
    </div>
  )
}
