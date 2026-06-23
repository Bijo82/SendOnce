import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  holographic?: boolean
}

export function GlassCard({ children, className = '', holographic = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-panel rounded-2xl p-6 md:p-8 ${holographic ? 'holographic-border' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
