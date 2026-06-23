import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { useCountdown } from '../../hooks/useCountdown'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { getShareUrl } from '../../utils/otp'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'

interface ShareSuccessProps {
  otp: string
  expiresIn: number
  shareType: 'file' | 'text'
}

export function ShareSuccess({ otp, expiresIn, shareType }: ShareSuccessProps) {
  const { copied, copy } = useCopyToClipboard()
  const { formatted, isExpired } = useCountdown(expiresIn)
  const shareUrl = getShareUrl(otp)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 py-2"
    >
      {/* Success header */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="flex flex-col items-center gap-3"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-8 w-8 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />
          </motion.svg>
        </div>
        <h3 className="text-2xl font-semibold text-white">Share Ready</h3>
        <p className="text-sm text-slate-400">
          Your {shareType === 'file' ? 'file' : 'text'} is encrypted and ready to share
        </p>
      </motion.div>

      {/* OTP Card */}
      <GlassCard holographic className="w-full text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
          One-Time Password
        </p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="relative"
        >
          <p
            className="font-mono text-4xl font-bold tracking-[0.3em] text-white md:text-5xl"
            aria-label={`OTP: ${otp.split('').join(' ')}`}
          >
            {otp}
          </p>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-400/10 blur-xl" />
        </motion.div>

        <div className="mt-5">
          <Button
            variant="secondary"
            onClick={() => copy(otp)}
            disabled={isExpired}
            aria-label="Copy OTP to clipboard"
          >
            {copied ? (
              <>
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy OTP
              </>
            )}
          </Button>
        </div>
      </GlassCard>

      {/* QR Code */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full"
      >
        <GlassCard className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-white p-4 shadow-lg shadow-indigo-500/10">
            <QRCodeSVG
              value={shareUrl}
              size={160}
              level="M"
              bgColor="#ffffff"
              fgColor="#0f172a"
              aria-label={`QR code for ${shareUrl}`}
            />
          </div>
          <p className="text-sm text-slate-400">Scan to access shared content</p>
          <p className="max-w-full truncate font-mono text-xs text-slate-500">{shareUrl}</p>
        </GlassCard>
      </motion.div>

      {/* Countdown */}
      <motion.div
        animate={isExpired ? { opacity: 0.5 } : {}}
        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3"
        role="timer"
        aria-live="polite"
        aria-label={isExpired ? 'Share expired' : `Expires in ${formatted}`}
      >
        <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs text-slate-500">Expires in</p>
          <motion.p
            key={formatted}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-mono text-xl font-semibold ${isExpired ? 'text-red-400' : 'text-white'}`}
          >
            {formatted}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}
