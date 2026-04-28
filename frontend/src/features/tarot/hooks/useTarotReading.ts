import { useCallback, useMemo, useState } from 'react'
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source'
import MarkdownIt from 'markdown-it'
import { useGlobalState } from '@/store'
import { saveHistory } from '@/utils/divinationHistory'
import { allCards } from '@/features/tarot/cards'
import { getDefaultSpread } from '@/features/tarot/spreads'
import type { DrawnCard, Spread, Reading } from '@/features/tarot/types'
import { streamDirectFromOpenAI } from '@/lib/pureFrontendDivination'

export type ReadingPhase = 'question' | 'spread' | 'shuffle' | 'draw' | 'reveal' | 'interpret'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const IS_TAURI = import.meta.env.VITE_IS_TAURI || ''
const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

interface StartInterpretationParams {
  question: string
  spread: Spread
  drawnCards: DrawnCard[]
}

function buildPrompt({ question, spread, drawnCards }: StartInterpretationParams): string {
  const cardLines = drawnCards
    .map((drawn, index) => {
      const orientation = drawn.isReversed ? '逆位' : '正位'
      return `${index + 1}. ${drawn.position.nameCn}：${drawn.card.nameCn}（${orientation}）`
    })
    .join('\n')

  return [
    `问题：${question}`,
    `牌阵：${spread.nameCn}`,
    '抽到的牌：',
    cardLines,
    '请结合塔罗语境进行结构化解读，包含现状、关键阻力、行动建议与注意事项。',
  ].join('\n')
}

export function useTarotReading() {
  const [phase, setPhase] = useState<ReadingPhase>('question')
  const [question, setQuestion] = useState('')
  const [spread, setSpread] = useState<Spread>(getDefaultSpread())
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [interpretation, setInterpretation] = useState('')
  const [isInterpreting, setIsInterpreting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { jwt, customOpenAISettings } = useGlobalState()

  const shuffleAndDraw = useCallback(() => {
    const shuffled = [...allCards].sort(() => Math.random() - 0.5)
    const drawn: DrawnCard[] = spread.positions.map((position, index) => ({
      card: shuffled[index],
      isReversed: Math.random() > 0.5,
      position,
    }))

    setDrawnCards(drawn)
    setRevealedCount(0)
    setPhase('draw')
  }, [spread])

  const revealNextCard = useCallback(() => {
    setRevealedCount((prev) => {
      const next = Math.min(prev + 1, drawnCards.length)
      if (next >= drawnCards.length) {
        setPhase('reveal')
      }
      return next
    })
  }, [drawnCards.length])

  const revealAllCards = useCallback(() => {
    setRevealedCount(drawnCards.length)
    setPhase('reveal')
  }, [drawnCards.length])

  const readingSnapshot = useMemo<Reading | null>(() => {
    if (!question || drawnCards.length === 0) {
      return null
    }

    return {
      id: crypto.randomUUID(),
      question,
      spread,
      drawnCards,
      createdAt: new Date(),
    }
  }, [question, spread, drawnCards])

  const startInterpretation = useCallback(async () => {
    if (!readingSnapshot) {
      return
    }

    setIsInterpreting(true)
    setInterpretation('')
    setError(null)
    setPhase('interpret')

    const prompt = buildPrompt({
      question: readingSnapshot.question,
      spread: readingSnapshot.spread,
      drawnCards: readingSnapshot.drawnCards,
    })

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${jwt || 'xxx'}`,
        'Content-Type': 'application/json',
      }

      if (customOpenAISettings.enable) {
        headers['x-api-key'] = customOpenAISettings.apiKey
        headers['x-api-url'] = customOpenAISettings.baseUrl
        headers['x-api-model'] = customOpenAISettings.model
      } else if (IS_TAURI) {
        setError('请在设置中配置 API BASE URL 和 API KEY')
        return
      }

      let buffer = ''

      if (!API_BASE) {
        await streamDirectFromOpenAI({
          body: {
            prompt_type: 'tarot',
            prompt,
          },
          customOpenAISettings,
          onToken(token) {
            buffer += token
            const cleanText = buffer.replace(/ \*\*/g, '**').replace(/^ +###/gm, '###')
            setInterpretation(md.render(cleanText))
          },
        })
        if (buffer) {
          saveHistory({
            type: 'tarot',
            title: '塔罗牌占卜',
            prompt: readingSnapshot.question,
            result: buffer,
          })
        }
        if (!buffer) {
          setError('未收到有效解读内容，请稍后重试。')
        }
        return
      }

      await fetchEventSource(`${API_BASE}/api/divination`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt_type: 'tarot',
          prompt,
        }),
        async onopen(response) {
          if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
            return
          }

          if (response.status >= 400) {
            throw new Error(`${response.status} ${await response.text()}`)
          }
        },
        onmessage(message) {
          if (message.event === 'FatalError') {
            throw new Error(message.data)
          }

          if (!message.data) {
            return
          }

          try {
            const content = JSON.parse(message.data) as string
            buffer += content
            const cleanText = buffer.replace(/ \*\*/g, '**').replace(/^ +###/gm, '###')
            setInterpretation(md.render(cleanText))
          } catch {
            // ignore malformed chunks
          }
        },
        onclose() {
          if (buffer) {
            saveHistory({
              type: 'tarot',
              title: '塔罗牌占卜',
              prompt: readingSnapshot.question,
              result: buffer,
            })
          }
        },
        onerror(streamError) {
          throw new Error(streamError.message)
        },
      })

      if (!buffer) {
        setError('未收到有效解读内容，请稍后重试。')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '解读失败')
    } finally {
      setIsInterpreting(false)
    }
  }, [customOpenAISettings, jwt, readingSnapshot])

  const reset = useCallback(() => {
    setPhase('question')
    setQuestion('')
    setSpread(getDefaultSpread())
    setDrawnCards([])
    setRevealedCount(0)
    setInterpretation('')
    setIsInterpreting(false)
    setError(null)
  }, [])

  const goToPhase = useCallback((nextPhase: ReadingPhase) => {
    setPhase(nextPhase)
  }, [])

  return {
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
  }
}
