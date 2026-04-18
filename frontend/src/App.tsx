import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { useGlobalState } from '@/store'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sparkles } from 'lucide-react'
import MainLayout from '@/layouts/MainLayout'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const MarketPage = lazy(() => import('@/pages/Market'))
const AboutPage = lazy(() => import('@/pages/About'))
const SettingsPage = lazy(() => import('@/pages/Settings'))
const LoginPage = lazy(() => import('@/pages/Login'))
const HistoryPage = lazy(() => import('@/pages/History'))
const TarotPage = lazy(() => import('@/pages/divination/TarotPage'))
const BirthdayPage = lazy(() => import('@/pages/divination/BirthdayPage'))
const NewNamePage = lazy(() => import('@/pages/divination/NewNamePage'))
const NamePage = lazy(() => import('@/pages/divination/NamePage'))
const DreamPage = lazy(() => import('@/pages/divination/DreamPage'))
const PlumFlowerPage = lazy(() => import('@/pages/divination/PlumFlowerPage'))
const FatePage = lazy(() => import('@/pages/divination/FatePage'))

function RouteLoadingFallback() {
  return <div className="text-center py-12 text-muted-foreground">页面加载中...</div>
}

function App() {
  const {
    jwt,
    setSettings,
    settings
  } = useGlobalState()

  const [loading, setLoading] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const settingsUrl = `${API_BASE}/api/v1/settings`
      const response = await fetch(settingsUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt || 'xxx'}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const contentType = response.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          const hint = API_BASE
            ? `接口 ${settingsUrl} 返回了非 JSON 内容，请确认该地址是否为后端 API。`
            : '当前站点返回了 HTML（不是 JSON），请在部署平台配置 VITE_API_BASE 指向后端 API 域名。'
          throw new Error(hint)
        }
        const data = await response.json()
        setSettings({ ...data, fetched: true, error: null })
      } else {
        setSettings({
          fetched: true,
          error: `Failed to fetch settings: ${response.status} ${response.statusText}`,
        })
      }
    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : 'unknown error'
      setSettings({
        fetched: true,
        error: `Failed to fetch settings: ${message}`,
      })
    } finally {
      setLoading(false)
    }
  }, [jwt, setSettings])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              星辰指引中...
            </p>
          </div>
        </div>
      )}

      <MainLayout>
        {settings.fetched && !settings.error ? (
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<MarketPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/divination/tarot" element={<TarotPage />} />
              <Route path="/divination/birthday" element={<BirthdayPage />} />
              <Route path="/divination/new_name" element={<NewNamePage />} />
              <Route path="/divination/name" element={<NamePage />} />
              <Route path="/divination/dream" element={<DreamPage />} />
              <Route path="/divination/plum_flower" element={<PlumFlowerPage />} />
              <Route path="/divination/fate" element={<FatePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/:login_type" element={<LoginPage />} />
              <Route path="/history/:type" element={<HistoryPage />} />
            </Routes>
          </Suspense>
        ) : settings.error ? (
          <Alert variant="destructive" className="glass">
            <AlertDescription>{settings.error}</AlertDescription>
          </Alert>
        ) : null}
      </MainLayout>
      <Toaster />
    </>
  )
}

export default App
