import type { DivinationSubmitParams } from '@/hooks/useDivination'

interface CustomOpenAISettings {
  enable: boolean
  baseUrl: string
  apiKey: string
  model: string
}

interface LLMConfig {
  baseUrl: string
  apiKey: string
  model: string
}

interface DivinationRequestBody extends Record<string, unknown> {
  prompt_type: string
  prompt?: string
  birthday?: string
  new_name?: {
    surname: string
    sex: string
    birthday: string
    new_name_prompt: string
  }
  plum_flower?: {
    num1: number
    num2: number
  }
  fate?: {
    name1: string
    name2: string
  }
}

const SYSTEM_PROMPTS: Record<string, string> = {
  tarot: '我请求你担任塔罗占卜师的角色。您将接受我的问题并使用虚拟塔罗牌进行塔罗牌阅读。不要忘记洗牌并介绍您在本套牌中使用的套牌。请帮我抽3张随机卡。拿到卡片后，请您仔细说明它们的意义，解释哪张卡片属于未来或现在或过去，结合我的问题来解释它们，并给我有用的建议或我现在应该做的事情。',
  birthday: '我请求你担任中国传统的生辰八字算命的角色。我将会给你我的生日，请你根据我的生日推算命盘，分析五行属性、吉凶祸福、财运、婚姻、健康、事业等方面的情况，并为其提供相应的指导和建议。',
  name: '我请求你担任中国传统的姓名五格算命师的角色。我将会给你我的名字，请你根据我的名字推算，分析姓氏格、名字格、和自己格。并为其提供相应的指导和建议。',
  dream: '我请求你担任中国传统的周公解梦师的角色。我将会给你我的梦境，请你解释我的梦境，并为其提供相应的指导和建议。',
  new_name: '我请求你担任起名师的角色，我将会给你我的姓氏、生日、性别等，请返回你认为最适合我的名字，请注意姓氏在前，名字在后。',
  plum_flower: '我请求你担任中国传统的梅花易数占卜师的角色。我会随意说出两个数，第一个数取为上卦，第二个数取为下卦。请你直接以数起卦, 并向我解释结果',
  fate: '你是一个姻缘助手，我给你发两个人的名字，用逗号隔开，你来随机说一下，这两个人之间的缘分如何？不需要很真实，只需要娱乐化的说一下即可，你可以根据人名先判断一下这个人名的真实性，如果输入是一些类似张三李四之类的，就返回不合适，或者如果两个人的名字性别，都是同性，也最好返回不合适。然后基本主要围绕, 90%的概率说二人很合适, 然后10%的概率，说对方不合适，并列出为啥这样的原因。',
}

const FALLBACK_CONFIG: LLMConfig = {
  baseUrl: import.meta.env.VITE_FALLBACK_API_BASE || '',
  apiKey: import.meta.env.VITE_FALLBACK_API_KEY || '',
  model: import.meta.env.VITE_FALLBACK_MODEL || import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o-mini',
}

const RATE_LIMIT_PER_HOUR = Number(import.meta.env.VITE_RATE_LIMIT_PER_HOUR || 10)
const MAX_OUTPUT_TOKENS = Number(import.meta.env.VITE_MAX_OUTPUT_TOKENS || 2000)
const RATE_LIMIT_STORAGE_KEY = 'pure-frontend-rate-limit'

function checkRateLimit(): boolean {
  if (!Number.isFinite(RATE_LIMIT_PER_HOUR) || RATE_LIMIT_PER_HOUR <= 0) {
    return true
  }
  const now = Date.now()
  const raw = localStorage.getItem(RATE_LIMIT_STORAGE_KEY)
  if (!raw) {
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify({ count: 1, resetAt: now + 3600000 }))
    return true
  }
  try {
    const parsed = JSON.parse(raw) as { count: number; resetAt: number }
    if (now > parsed.resetAt) {
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify({ count: 1, resetAt: now + 3600000 }))
      return true
    }
    if (parsed.count >= RATE_LIMIT_PER_HOUR) {
      return false
    }
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify({ count: parsed.count + 1, resetAt: parsed.resetAt }))
    return true
  } catch {
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify({ count: 1, resetAt: now + 3600000 }))
    return true
  }
}

function resolveRequestUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/$/, '')
  if (normalized.includes('/chat/completions')) {
    return normalized
  }
  return `${normalized}/chat/completions`
}

function resolveLLMConfig(customOpenAISettings: CustomOpenAISettings): { config: LLMConfig; usingFallback: boolean } {
  if (
    customOpenAISettings.enable &&
    customOpenAISettings.apiKey &&
    customOpenAISettings.baseUrl &&
    customOpenAISettings.model
  ) {
    return {
      config: {
        baseUrl: customOpenAISettings.baseUrl,
        apiKey: customOpenAISettings.apiKey,
        model: customOpenAISettings.model,
      },
      usingFallback: false,
    }
  }

  if (FALLBACK_CONFIG.apiKey && FALLBACK_CONFIG.baseUrl && FALLBACK_CONFIG.model) {
    return { config: FALLBACK_CONFIG, usingFallback: true }
  }

  throw new Error('请先在设置中填写 API BASE URL / API KEY / MODEL，或配置 VITE_FALLBACK_API_* 默认值')
}

function formatBirthday(raw: string): string {
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) {
    throw new Error('生日格式错误')
  }
  return `我的生日是${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`
}

export function buildPromptForPureFrontend(body: DivinationRequestBody): { prompt: string; systemPrompt: string } {
  const systemPrompt = SYSTEM_PROMPTS[body.prompt_type]
  if (!systemPrompt) {
    throw new Error(`不支持的占卜类型: ${body.prompt_type}`)
  }

  switch (body.prompt_type) {
    case 'tarot':
      return { prompt: String(body.prompt || ''), systemPrompt }
    case 'birthday':
      return { prompt: formatBirthday(String(body.birthday || '')), systemPrompt }
    case 'name':
      return { prompt: `我的名字是${String(body.prompt || '')}`, systemPrompt }
    case 'dream':
      return { prompt: `我的梦境是: ${String(body.prompt || '')}`, systemPrompt }
    case 'new_name': {
      const profile = body.new_name
      if (!profile) {
        throw new Error('起名参数错误')
      }
      let prompt = `姓氏是${profile.surname},生日是${formatBirthday(String(body.birthday || profile.birthday)).replace('我的生日是', '')}`
      if (profile.new_name_prompt) {
        prompt += `,我的要求是: ${profile.new_name_prompt}`
      }
      return { prompt, systemPrompt }
    }
    case 'plum_flower': {
      const nums = body.plum_flower
      if (!nums) {
        throw new Error('梅花易数参数错误')
      }
      return { prompt: `我选择的数字是: ${nums.num1} 和 ${nums.num2}`, systemPrompt }
    }
    case 'fate': {
      const fate = body.fate
      if (!fate) {
        throw new Error('姻缘占卜参数错误')
      }
      return { prompt: `${fate.name1}, ${fate.name2}`, systemPrompt }
    }
    default:
      throw new Error(`不支持的占卜类型: ${body.prompt_type}`)
  }
}

export async function streamDirectFromOpenAI(options: {
  body: DivinationRequestBody
  customOpenAISettings: CustomOpenAISettings
  onToken: (token: string) => void
}): Promise<void> {
  const { body, customOpenAISettings, onToken } = options
  const { config, usingFallback } = resolveLLMConfig(customOpenAISettings)
  if (usingFallback && !checkRateLimit()) {
    throw new Error(`默认 Key 已触发限流：每小时最多 ${RATE_LIMIT_PER_HOUR} 次。请在设置中填写你自己的 API Key。`)
  }

  const { prompt, systemPrompt } = buildPromptForPureFrontend(body)
  const response = await fetch(resolveRequestUrl(config.baseUrl), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      stream: true,
      max_tokens: Number.isFinite(MAX_OUTPUT_TOKENS) ? MAX_OUTPUT_TOKENS : 2000,
      temperature: 0.9,
      top_p: 1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`模型请求失败: ${response.status} ${response.statusText}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line.startsWith('data:')) {
        continue
      }
      const data = line.slice(5).trim()
      if (!data || data === '[DONE]') {
        continue
      }
      try {
        const payload = JSON.parse(data) as {
          choices?: Array<{ delta?: { content?: string } }>
        }
        const token = payload.choices?.[0]?.delta?.content
        if (token) {
          onToken(token)
        }
      } catch {
        // ignore malformed chunks
      }
    }
  }
}

export function buildDivinationBody(promptType: string, params: DivinationSubmitParams): DivinationRequestBody {
  return {
    ...params,
    prompt_type: promptType,
  }
}
