import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { downloadContent, previewContent, triggerFileDownload } from '../../services/api'
import type { PreviewResponse } from '../../types/api'
import { DOWNLOAD_MESSAGES } from '../../utils/constants'
import { isValidOtp, normalizeOtp } from '../../utils/otp'
import { Button } from '../ui/Button'
import { ColdStartLoader } from '../ui/ColdStartLoader'
import { GlassCard } from '../ui/GlassCard'
import { OtpInput } from '../ui/OtpInput'
import { PreviewCard } from './PreviewCard'
import { TextViewer } from './TextViewer'

interface RetrieveSectionProps {
  initialOtp?: string
}

export function RetrieveSection({ initialOtp = '' }: RetrieveSectionProps) {
  const [otp, setOtp] = useState(normalizeOtp(initialOtp))
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [textContent, setTextContent] = useState<string | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [isColdStart, setIsColdStart] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    if (initialOtp) {
      setOtp(normalizeOtp(initialOtp))
    }
  }, [initialOtp])

  const previewMutation = useMutation({
    mutationFn: (code: string) =>
      previewContent(code, (cold) => setIsColdStart(cold)),
    onSuccess: (data) => {
      setPreview(data)
      toast.success('Content found!')
    },
    onError: (error: { message?: string }) => {
      setPreview(null)
      toast.error(error.message ?? 'Verification failed')
    },
  })

  const downloadMutation = useMutation({
    mutationFn: (code: string) => {
      setPhaseIndex(0)
      return downloadContent(code, (cold) => setIsColdStart(cold))
    },
    onSuccess: (result) => {
      if (result.type === 'text' && result.text) {
        setTextContent(result.text)
        setShowViewer(true)
        toast.success('Content loaded!')
      } else if (result.type === 'file') {
        triggerFileDownload(result.data, result.filename ?? 'download')
        toast.success('Download started!')
      }
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? 'Download failed')
    },
  })

  useEffect(() => {
    if (!downloadMutation.isPending) {
      setPhaseIndex(0)
      return
    }

    const interval = window.setInterval(() => {
      setPhaseIndex((prev) => Math.min(prev + 1, DOWNLOAD_MESSAGES.length - 1))
    }, 1200)

    return () => window.clearInterval(interval)
  }, [downloadMutation.isPending])

  const handleVerify = useCallback(() => {
    if (!isValidOtp(otp)) {
      toast.error('Please enter a valid 6-character OTP.')
      return
    }
    setPreview(null)
    setIsColdStart(false)
    previewMutation.mutate(otp)
  }, [otp, previewMutation])

  const handleDownload = useCallback(() => {
    if (!isValidOtp(otp)) return
    downloadMutation.mutate(otp)
  }, [otp, downloadMutation])

  const handleOpenText = useCallback(() => {
    if (textContent) {
      setShowViewer(true)
      return
    }
    handleDownload()
  }, [textContent, handleDownload])

  useEffect(() => {
    const normalized = normalizeOtp(initialOtp)
    if (normalized && isValidOtp(normalized)) {
      previewMutation.mutate(normalized)
    }
    // Auto-verify only on mount when arriving via /share/:otp
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isVerifying = previewMutation.isPending
  const isDownloading = downloadMutation.isPending
  const downloadMessage = DOWNLOAD_MESSAGES[phaseIndex] ?? DOWNLOAD_MESSAGES[0]

  return (
    <section className="relative z-10 mx-auto max-w-2xl px-4 pb-16 pt-4" aria-labelledby="retrieve-heading">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <GlassCard>
          <h2 id="retrieve-heading" className="mb-2 text-center text-xl font-semibold text-white">
            Retrieve Shared Content
          </h2>
          <p className="mb-6 text-center text-sm text-slate-400">
            Enter the 6-character OTP to preview and access shared content
          </p>

          <OtpInput value={otp} onChange={setOtp} disabled={isVerifying || isDownloading} />

          <div className="mt-6">
            {isVerifying && isColdStart ? (
              <ColdStartLoader />
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleVerify}
                loading={isVerifying}
                disabled={!isValidOtp(otp)}
              >
                Verify OTP
              </Button>
            )}
          </div>

          {preview && (
            <div className="mt-8">
              <PreviewCard
                preview={preview}
                onDownload={handleDownload}
                onOpenText={handleOpenText}
                isDownloading={isDownloading}
                downloadPhase={downloadMessage}
              />
            </div>
          )}
        </GlassCard>
      </motion.div>

      <TextViewer
        content={textContent ?? ''}
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
      />
    </section>
  )
}
