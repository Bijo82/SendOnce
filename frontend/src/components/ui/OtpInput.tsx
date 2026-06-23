import { motion } from 'framer-motion'
import { OTP_LENGTH } from '../../utils/constants'
import { normalizeOtp } from '../../utils/otp'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  id?: string
  label?: string
}

export function OtpInput({
  value,
  onChange,
  disabled = false,
  id = 'otp-input',
  label = 'Enter OTP',
}: OtpInputProps) {
  const handleChange = (input: string) => {
    onChange(normalizeOtp(input))
  }

  return (
    <div className="space-y-4">
      <label htmlFor={id} className="block text-center text-sm font-medium text-slate-300">
        {label}
      </label>

      {/* Visual character boxes */}
      <div className="flex justify-center gap-2 sm:gap-3" aria-hidden>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <motion.div
            key={index}
            animate={{
              borderColor: value[index]
                ? 'rgba(99, 102, 241, 0.6)'
                : 'rgba(255, 255, 255, 0.1)',
              boxShadow: value[index]
                ? '0 0 20px rgba(99, 102, 241, 0.2)'
                : 'none',
            }}
            className="flex h-14 w-11 items-center justify-center rounded-xl border bg-white/5 text-xl font-bold tracking-widest text-white sm:h-16 sm:w-12"
          >
            {value[index] ?? ''}
          </motion.div>
        ))}
      </div>

      <input
        id={id}
        type="text"
        inputMode="text"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        aria-label={label}
        placeholder="Enter 6-character OTP"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-lg font-mono tracking-[0.4em] text-white uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-600 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
      />
    </div>
  )
}
