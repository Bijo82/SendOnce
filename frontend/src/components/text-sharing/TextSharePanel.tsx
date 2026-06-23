import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { uploadText } from '../../services/api'
import { formatBytes } from '../../utils/errors'
import { MAX_TEXT_LENGTH } from '../../utils/constants'
import { useUploadPhases } from '../../hooks/useUploadPhases'
import { ShareSuccess } from '../success/ShareSuccess'
import { Button } from '../ui/Button'
import { ColdStartLoader } from '../ui/ColdStartLoader'
import { GlassCard } from '../ui/GlassCard'

export function TextSharePanel() {
  const [text, setText] = useState('')
  const [isColdStart, setIsColdStart] = useState(false)
  const [success, setSuccess] = useState<{ otp: string; expiresIn: number } | null>(null)

  const uploadMutation = useMutation({
    mutationFn: (content: string) =>
      uploadText(content, (cold) => setIsColdStart(cold)),
    onSuccess: (data) => {
      setSuccess({ otp: data.otp, expiresIn: data.expires_in })
      toast.success('Text shared successfully!')
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? 'Upload failed')
    },
  })

  const isUploading = uploadMutation.isPending
  const { message: phaseMessage } = useUploadPhases(isUploading, false)

  const textSize = new Blob([text]).size

  const handleShare = () => {
    if (!text.trim()) {
      toast.error('Please enter some text before sharing.')
      return
    }
    if (text.length > MAX_TEXT_LENGTH) {
      toast.error('Text exceeds the maximum allowed length.')
      return
    }
    setIsColdStart(false)
    uploadMutation.mutate(text)
  }

  const handleClear = () => setText('')

  if (success) {
    return (
      <GlassCard className="h-full">
        <ShareSuccess otp={success.otp} expiresIn={success.expiresIn} shareType="text" />
      </GlassCard>
    )
  }

  return (
    <GlassCard className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Text Sharing</h2>
        <p className="mt-1 text-sm text-slate-400">Share text securely with a one-time code</p>
      </div>

      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isUploading}
          placeholder="Enter your text here..."
          maxLength={MAX_TEXT_LENGTH}
          aria-label="Text to share"
          className="h-full min-h-[200px] w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white placeholder:text-slate-600 focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 md:min-h-[260px]"
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span aria-live="polite">{text.length.toLocaleString()} characters</span>
        <span>{formatBytes(textSize)}</span>
      </div>

      <div className="mt-6 flex gap-3">
        {isUploading ? (
          <div className="flex w-full flex-col items-center gap-4 py-2">
            {isColdStart ? (
              <ColdStartLoader />
            ) : (
              <>
                <motion.p
                  key={phaseMessage}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-medium text-indigo-200"
                >
                  {phaseMessage}
                </motion.p>
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
              </>
            )}
          </div>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClear} disabled={!text} className="flex-1">
              Clear
            </Button>
            <Button onClick={handleShare} disabled={!text.trim()} className="flex-[2]">
              Generate OTP
            </Button>
          </>
        )}
      </div>
    </GlassCard>
  )
}
