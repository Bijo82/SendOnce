import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number
  label?: string
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      {label && (
        <div className="flex justify-between text-sm text-slate-400">
          <span>{label}</span>
          <span className="font-mono text-indigo-300">{progress}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
