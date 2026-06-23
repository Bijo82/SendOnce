import { useEffect, useState } from 'react'
import { UPLOAD_MESSAGES } from '../utils/constants'
import type { UploadPhase } from '../types/api'

export function useUploadPhases(isUploading: boolean, hasProgress: boolean) {
  const [phase, setPhase] = useState<UploadPhase>('idle')
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    if (!isUploading) {
      setPhase('idle')
      setMessageIndex(0)
      return
    }

    setPhase(hasProgress ? 'uploading' : 'encrypting')

    const interval = window.setInterval(() => {
      setMessageIndex((prev) => {
        const next = (prev + 1) % UPLOAD_MESSAGES.length
        const phases: UploadPhase[] = ['uploading', 'encrypting', 'generating', 'preparing']
        setPhase(phases[next] ?? 'preparing')
        return next
      })
    }, 1800)

    return () => window.clearInterval(interval)
  }, [isUploading, hasProgress])

  const message = UPLOAD_MESSAGES[messageIndex] ?? UPLOAD_MESSAGES[0]

  return { phase, message }
}
