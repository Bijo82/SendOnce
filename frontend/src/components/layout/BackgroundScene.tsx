import { motion } from 'framer-motion'

export function BackgroundScene() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.25),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_60%,rgba(168,85,247,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_10%_80%,rgba(34,211,238,0.08),transparent)]" />

      {/* Animated data streams */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute h-px w-32 bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
          style={{ top: `${15 + i * 14}%`, left: '-8rem' }}
          animate={{ x: ['0vw', '120vw'] }}
          transition={{
            duration: 8 + i * 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 1.2,
          }}
        />
      ))}

      {/* Floating particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-white"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
            opacity: 0.1 + (i % 5) * 0.05,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + (i % 4),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Orbiting geometric shapes */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute left-0 top-1/2 h-16 w-16 -translate-y-1/2 rotate-45 border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm" />
        <div className="absolute right-0 top-1/4 h-12 w-12 rounded-full border border-purple-500/20 bg-purple-500/5" />
        <div className="absolute bottom-0 left-1/3 h-10 w-10 rotate-12 border border-cyan-400/20 bg-cyan-400/5" />
      </motion.div>

      <motion.div
        className="absolute right-[10%] top-[20%] h-24 w-24 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[8%] h-20 w-20 rounded-full border border-indigo-500/10 bg-indigo-500/5"
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030712_75%)]" />
    </div>
  )
}
