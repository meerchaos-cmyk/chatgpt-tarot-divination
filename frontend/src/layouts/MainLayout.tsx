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
    }, 800)
  }

  return (
    <div
      className="min-h-screen text-foreground overflow-x-hidden selection:bg-primary/30"
      onPointerDown={(event) => addRipple(event.clientX, event.clientY)}
    >
      <div className="cosmic-rotating-bg" />
      <div className="starlight-bg" />
      <div className="fixed inset-0 pointer-events-none z-50">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="click-ripple"
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}
      </div>
      <div className="fixed inset-0 -z-[2] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-primary/5 dark:bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-[80px] animate-pulse delay-1000" />
      </div>

      <div className="w-full px-4 md:px-8 py-4 md:py-6">
        <div className="flex flex-col min-h-[calc(100vh-3rem)] md:px-12 lg:px-24">
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass rounded-2xl p-4 mb-8 sticky top-4 z-40"
          >
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative p-2.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                  <Sparkles className="h-5 w-5 text-primary group-hover:rotate-12 transition-transform duration-500" />
                  <div className="absolute inset-0 blur-md bg-primary/20 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gradient-gold tracking-widest font-serif">
                    AI 占卜
                  </h1>
                  <p className="text-[10px] md:text-xs text-muted-foreground/80 tracking-widest hidden sm:block uppercase mt-0.5">
                    Explore The Unknown
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-1 md:gap-3">
                <BackgroundMusic />

                <Button variant="ghost" size="icon" onClick={() => navigate('/')} title="主页" className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                  <Home className="h-5 w-5" />
                </Button>

                {settings.enable_login && (
                  settings.user_name ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={logOut}
                      className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:inline tracking-widest text-xs">登出</span>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="gap-2 tarot-btn-mystic rounded-full"
                    >
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:inline tracking-widest text-xs">登录</span>
                    </Button>
                  )
                )}

                <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} title="设置" className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
                  <Settings className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleDark} title="切换主题" className="hover:bg-primary/10 hover:text-primary transition-colors rounded-full">
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
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-amber-500/20">
                      <span className="flex items-center gap-2 font-medium tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                        游客体验模式 ({settings.rate_limit})
                      </span>
                      <Link to="/settings" className="hover:text-amber-200 transition-colors uppercase tracking-widest text-[10px]">
                        配置专属能量源 &rarr;
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>

          <main className="flex-1 relative z-10">{children}</main>

          <footer className="mt-12 py-8 text-center border-t border-border/30 relative z-10">
            <p className="text-sm text-muted-foreground/60 tracking-widest uppercase font-light">
              © {new Date().getFullYear()} AI Tarot Divination · Trust your intuition
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
