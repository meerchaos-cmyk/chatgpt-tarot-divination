import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DivinationCardHeader } from '@/components/DivinationCardHeader'
import { useGlobalState, MUSIC_OPTIONS } from '@/store'
import { Save, Settings as SettingsIcon, ExternalLink, CheckCircle2, Music2 } from 'lucide-react'

const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1'
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'

export default function SettingsPage() {
  const {
    customOpenAISettings,
    setCustomOpenAISettings,
    settings,
    selectedMusic,
    setSelectedMusic,
    isMusicMuted,
    toggleMusicMuted,
  } = useGlobalState()

  const [tempSettings, setTempSettings] = useState({
    enable: false,
    baseUrl: '',
    apiKey: '',
    model: '',
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setTempSettings({
      enable: customOpenAISettings.enable,
      baseUrl: customOpenAISettings.baseUrl || DEFAULT_OPENAI_BASE_URL,
      apiKey: customOpenAISettings.apiKey || '',
      model: customOpenAISettings.model || DEFAULT_OPENAI_MODEL,
    })
  }, [customOpenAISettings, settings])

  const goToPurchase = () => {
    if (settings.purchase_url) {
      window.open(settings.purchase_url, '_blank')
    }
  }

  const saveSettings = async () => {
    setLoading(true)
    setSaved(false)
    try {
      setCustomOpenAISettings(tempSettings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const hasPurchaseUrl = settings.purchase_url && settings.purchase_url !== ''

  return (
    <DivinationCardHeader
      title="设置"
      description="自定义您的应用配置"
      icon={SettingsIcon}
    >
      <div className="w-full max-w-3xl mx-auto space-y-8">
        {/* ── 背景音乐设置 ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-wide">背景音乐</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="music-enabled" className="text-sm md:text-base font-medium">启用背景音乐</Label>
                <p className="text-xs md:text-sm text-muted-foreground">控制背景音乐的播放与静音</p>
              </div>
              <Switch
                id="music-enabled"
                checked={!isMusicMuted}
                onCheckedChange={toggleMusicMuted}
              />
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="music-select" className="text-sm md:text-base">选择音乐</Label>
              <select
                id="music-select"
                value={selectedMusic}
                onChange={(event) => setSelectedMusic(event.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="选择背景音乐"
              >
                {MUSIC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ── 分隔线 ── */}
        <hr className="border-border/50" />

        {/* ── API 设置 ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-wide">API 设置</h2>
          </div>

          <div className="flex justify-end mb-4 md:mb-6">
            <Button
              onClick={saveSettings}
              disabled={loading}
              className="gap-2 w-full md:w-auto"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  已保存
                </>
              ) : loading ? (
                '保存中...'
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存设置
                </>
              )}
            </Button>
          </div>

          {saved && (
            <Alert variant="success" className="animate-in slide-in-from-top duration-300 mb-4 md:mb-6">
              <AlertDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                设置已成功保存
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="enable-custom" className="text-sm md:text-base font-medium">启用自定义 API</Label>
                <p className="text-xs md:text-sm text-muted-foreground">使用您自己的 API 配置</p>
              </div>
              <Switch
                id="enable-custom"
                checked={tempSettings.enable}
                onCheckedChange={(checked) =>
                  setTempSettings({ ...tempSettings, enable: checked })
                }
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="base-url" className="text-sm md:text-base">API 地址</Label>
              <Input
                id="base-url"
                value={tempSettings.baseUrl}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, baseUrl: e.target.value })
                }
                placeholder={DEFAULT_OPENAI_BASE_URL}
                className="h-11"
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="api-key" className="text-sm md:text-base">API 密钥</Label>
                {hasPurchaseUrl && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={goToPurchase}
                    className="h-auto p-0 gap-1"
                  >
                    获取 API KEY
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Input
                id="api-key"
                type="password"
                value={tempSettings.apiKey}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, apiKey: e.target.value })
                }
                placeholder="sk-..."
                className="h-11 font-mono"
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="model" className="text-sm md:text-base">模型</Label>
              <Input
                id="model"
                value={tempSettings.model}
                onChange={(e) =>
                  setTempSettings({ ...tempSettings, model: e.target.value })
                }
                placeholder={DEFAULT_OPENAI_MODEL}
                className="h-11"
              />
            </div>
          </div>
        </section>
      </div>
    </DivinationCardHeader>
  )
}

