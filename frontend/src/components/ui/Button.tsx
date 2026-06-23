import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  'aria-label'?: string
}

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110',
  secondary:
    'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
  ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/5',
  danger: 'bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export function Button({
  children,
  variant = 'primary',
  loading = false,
  size = 'md',
  disabled,
  className = '',
  onClick,
  type = 'button',
  'aria-label': ariaLabel,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={disabled || loading ? undefined : { scale: 1.02 }}
      whileTap={disabled || loading ? undefined : { scale: 0.98 }}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden
        />
      )}
      {children}
    </motion.button>
  )
}
