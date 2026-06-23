import { motion } from 'framer-motion'

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 mx-auto max-w-4xl px-4 pt-10 pb-8 text-center md:pt-14 md:pb-10"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-200"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
        </span>
        Files automatically expire after 10 minutes or after first download
      </motion.div>

      <h1 className="text-gradient text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
        SendOnce
      </h1>
      <p className="mt-3 text-base text-slate-400 md:text-lg">
        Secure OTP-based File &amp; Text Sharing
      </p>
    </motion.header>
  )
}
