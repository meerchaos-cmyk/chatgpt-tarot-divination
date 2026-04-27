import { useNavigate } from 'react-router-dom'
import { DIVINATION_OPTIONS } from '@/config/constants'
import { Sparkles, Info, Compass } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const item = {
  hidden: { y: 30, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
}

export default function MarketPage() {
  const navigate = useNavigate()

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-12"
    >
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-8 mb-16 animate-in fade-in duration-1000">
        <h2 className="text-4xl md:text-5xl font-serif text-gradient-gold tracking-widest drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          选择你的指引
        </h2>
        <p className="text-muted-foreground/80 tracking-widest font-light uppercase text-sm flex items-center justify-center gap-2">
          <Compass className="w-4 h-4 text-primary animate-pulse" />
          聆听宇宙的低语，洞察命运的轨迹
          <Compass className="w-4 h-4 text-primary animate-pulse" />
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 px-2 md:px-0">
        {DIVINATION_OPTIONS.map((option) => {
          const Icon = option.icon
          return (
            <motion.div
              key={option.key}
              variants={item}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="group relative cursor-pointer glass-card h-full rounded-2xl overflow-hidden flex flex-col"
                onClick={() => navigate(`/divination/${option.key}`)}
              >
                {/* Mystical Top Gradient Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent group-hover:via-primary transition-all duration-500" />
                
                {/* Inner Glow Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="p-6 md:p-8 flex flex-col items-center text-center flex-grow relative z-10">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-colors duration-500" />
                    <div className="relative p-4 rounded-full border border-primary/20 bg-background/50 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] transition-all duration-500">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-serif tracking-widest text-foreground group-hover:text-gradient-gold mb-3 transition-colors duration-300">
                    {option.label}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 font-light leading-relaxed flex-grow">
                    {option.description}
                  </p>
                </div>

                <div className="p-4 border-t border-border/30 bg-muted/30 group-hover:bg-primary/10 transition-colors duration-500 relative z-10 flex items-center justify-center">
                  <div className="flex items-center text-xs tracking-[0.2em] uppercase text-primary/80 group-hover:text-primary transition-colors">
                    <span>开始祈求</span>
                    <Sparkles className="h-3.5 w-3.5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* 关于卡片 */}
        <motion.div
          variants={item}
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className="group relative cursor-pointer glass-card h-full rounded-2xl overflow-hidden flex flex-col border-secondary/30 hover:border-secondary/60"
            onClick={() => navigate('/about')}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent group-hover:via-secondary transition-all duration-500" />
            
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="p-6 md:p-8 flex flex-col items-center text-center flex-grow relative z-10">
              <div className="mb-6 relative">
                <div className="absolute inset-0 bg-secondary/20 blur-xl rounded-full group-hover:bg-secondary/40 transition-colors duration-500" />
                <div className="relative p-4 rounded-full border border-secondary/20 bg-background/50 group-hover:border-secondary/50 group-hover:shadow-[0_0_20px_rgba(var(--secondary-rgb),0.4)] transition-all duration-500">
                  <Info className="h-8 w-8 text-secondary group-hover:text-secondary transition-colors duration-300" strokeWidth={1.5} />
                </div>
              </div>
              
              <h3 className="text-xl md:text-2xl font-serif tracking-widest text-foreground group-hover:text-gradient-mystic mb-3 transition-colors duration-300">
                神秘典籍
              </h3>
              
              <p className="text-sm text-muted-foreground/80 font-light leading-relaxed flex-grow">
                了解各种占卜方式的起源与深刻含义，探索古老智慧
              </p>
            </div>

            <div className="p-4 border-t border-border/30 bg-muted/30 group-hover:bg-secondary/10 transition-colors duration-500 relative z-10 flex items-center justify-center">
              <div className="flex items-center text-xs tracking-[0.2em] uppercase text-secondary/80 group-hover:text-secondary transition-colors">
                <span>翻阅典籍</span>
                <Sparkles className="h-3.5 w-3.5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
