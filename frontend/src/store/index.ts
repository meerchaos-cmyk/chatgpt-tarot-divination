import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CustomOpenAISettings {
  enable: boolean
  baseUrl: string
  apiKey: string
  model: string
}

interface Settings {
  fetched: boolean
  error: string | null
  user_name?: string
  login_type?: string
  enable_login?: boolean
  enable_rate_limit?: boolean
  rate_limit?: string
  ad_client?: string
  ad_slot?: string
  default_api_base?: string
  default_model?: string
  purchase_url?: string
}

export interface MusicOption {
  label: string
  value: string
}

export const MUSIC_OPTIONS: MusicOption[] = [
  { label: '花间', value: '/TarotWhisper/public/花间.mp3' },
  { label: 'The Oracle`s Last Card', value: '/TarotWhisper/public/The_Oracle_s_Last_Card.mp3' },
]

interface GlobalState {
  isDark: boolean
  jwt: string
  settings: Settings
  customOpenAISettings: CustomOpenAISettings
  isMusicMuted: boolean
  selectedMusic: string
  toggleDark: () => void
  setJwt: (jwt: string) => void
  setSettings: (settings: Partial<Settings>) => void
  setCustomOpenAISettings: (settings: Partial<CustomOpenAISettings>) => void
  toggleMusicMuted: () => void
  setSelectedMusic: (music: string) => void
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      isDark: true,
      jwt: '',
      settings: { fetched: false, error: null },
      customOpenAISettings: { enable: false, baseUrl: '', apiKey: '', model: '' },
      isMusicMuted: true,
      selectedMusic: MUSIC_OPTIONS[0].value,
      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
      setJwt: (jwt) => set({ jwt }),
      setSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
      setCustomOpenAISettings: (settings) =>
        set((state) => ({
          customOpenAISettings: { ...state.customOpenAISettings, ...settings },
        })),
      toggleMusicMuted: () => set((state) => ({ isMusicMuted: !state.isMusicMuted })),
      setSelectedMusic: (music) => set({ selectedMusic: music }),
    }),
    { name: 'global-state' }
  )
)
