import { motion } from 'framer-motion'

interface ColdStartLoaderProps {
  message?: string
}

export function ColdStartLoader({
  message = 'Waking server... This may take a few moments.',
}: ColdStartLoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-8 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-16 w-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-t-purple-400 border-r-transparent border-b-cyan-400 border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="h-3 w-3 rounded-full bg-indigo-400"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-indigo-200">Waking server...</p>
        <p className="mt-1 text-xs text-slate-500">{message}</p>
      </div>
    </motion.div>
  )
}
