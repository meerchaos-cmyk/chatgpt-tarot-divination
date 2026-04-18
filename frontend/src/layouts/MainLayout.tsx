import { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, Moon, Settings, Sparkles, Sun, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useGlobalState } from '@/store'
import { BackgroundMusic } from '@/components/BackgroundMusic'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const { isDark, toggleDark, settings, setJwt } = useGlobalState()
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const logOut = () => {
    setJwt('')
    window.location.reload()
  }

  const addRipple = (x: number, y: number) => {
    const id = Date.now() + Math.random()
    setRipples((prev) => [...prev, { id, x, y }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 650)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5 text-foreground overflow-x-hidden selection:bg-primary/30"
      onPointerDown={(event) => addRipple(event.clientX, event.clientY)}
    >
      <BackgroundMusic />
      <div className="cosmic-rotating-bg" />
      <div className="fixed inset-0 pointer-events-none z-20">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="click-ripple"
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}
      </div>
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] animate-pulse delay-1000" />
      </div>

      <div className="w-full px-4 md:px-8 py-4 md:py-6">
        <div className="flex flex-col min-h-[calc(100vh-3rem)] md:px-12 lg:px-24">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-card/40 border border-white/10 rounded-2xl shadow-lg p-4 mb-6 sticky top-2 z-50"
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <div className="absolute inset-0 blur-lg bg-primary/30 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent font-serif tracking-tight">
                    AI 占卜
                  </h1>
                  <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">探索未知 · 洞察未来</p>
                </div>
              </Link>

              <div className="flex items-center gap-1 md:gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')} title="主页">
                  <Home className="h-5 w-5" />
                </Button>

                {settings.enable_login && (
                  settings.user_name ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logOut}
                      className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline">登出</span>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="gap-2 bg-primary/80 hover:bg-primary"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline">登录</span>
                    </Button>
                  )
                )}

                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} title="设置">
                  <Settings className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleDark} title="切换主题">
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

              </div>
            </div>

            <AnimatePresence>
              {settings.fetched && !settings.user_name && settings.enable_rate_limit && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-md">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        游客限流模式 ({settings.rate_limit})
                      </span>
                      <Link to="/settings" className="hover:underline opacity-80 hover:opacity-100">
                        自定义配置 &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          <main className="flex-1 relative">{children}</main>

          <footer className="mt-8 py-6 text-center text-sm text-muted-foreground border-t border-border/40">
            <p>© {new Date().getFullYear()} AI Tarot Divination. Keep an open mind.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}
