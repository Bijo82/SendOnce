import { motion, AnimatePresence } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { uploadFile } from '../../services/api'
import { getFileValidationError, formatBytes } from '../../utils/errors'
import { useUploadPhases } from '../../hooks/useUploadPhases'
import { ShareSuccess } from '../success/ShareSuccess'
import { Button } from '../ui/Button'
import { ColdStartLoader } from '../ui/ColdStartLoader'
import { GlassCard } from '../ui/GlassCard'
import { ProgressBar } from '../ui/ProgressBar'

export function FileSharePanel() {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [isColdStart, setIsColdStart] = useState(false)
  const [success, setSuccess] = useState<{ otp: string; expiresIn: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const uploadMutation = useMutation({
    mutationFn: (selectedFiles: File[]) =>
      uploadFile(
        selectedFiles,
        (pct) => setProgress(pct),
        (cold) => setIsColdStart(cold),
      ),
    onSuccess: (data) => {
      setSuccess({ otp: data.otp, expiresIn: data.expires_in })
      toast.success('File uploaded successfully!')
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? 'Upload failed')
    },
  })

  const isUploading = uploadMutation.isPending
  const { message: phaseMessage } = useUploadPhases(isUploading, progress > 0 && progress < 100)

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newFiles = Array.from(incoming)
    const errors: string[] = []

    newFiles.forEach((file) => {
      const err = getFileValidationError(file)
      if (err) errors.push(err)
    })

    if (errors.length) {
      errors.forEach((e) => toast.error(e))
      return
    }

    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...newFiles.filter((f) => !names.has(f.name))]
    })
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (!files.length) {
      toast.error('Please select at least one file to upload.')
      return
    }
    setProgress(0)
    setIsColdStart(false)
    uploadMutation.mutate(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  if (success) {
    return (
      <GlassCard className="h-full">
        <ShareSuccess otp={success.otp} expiresIn={success.expiresIn} shareType="file" />
      </GlassCard>
    )
  }

  return (
    <GlassCard className="flex h-full flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">File Sharing</h2>
        <p className="mt-1 text-sm text-slate-400">Drag &amp; drop or browse to upload</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-300 ${
          isDragging
            ? 'border-indigo-400/60 bg-indigo-500/10'
            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
        }`}
        role="region"
        aria-label="File drop zone"
      >
        <motion.div
          animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-white">Drop files here</p>
            <p className="mt-1 text-sm text-slate-500">or click browse below</p>
          </div>
          <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={isUploading}>
            Browse Files
          </Button>
        </motion.div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          aria-hidden
        />
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 max-h-40 space-y-2 overflow-y-auto scrollbar-thin"
          >
            {files.map((file, index) => (
              <motion.li
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <svg className="h-5 w-5 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="ml-2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <div className="mt-6">
        {isUploading ? (
          <div className="space-y-4">
            {isColdStart ? (
              <ColdStartLoader />
            ) : (
              <>
                <motion.p
                  key={phaseMessage}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm font-medium text-indigo-200"
                >
                  {progress > 0 && progress < 100 ? `Uploading File...` : phaseMessage}
                </motion.p>
                {progress > 0 && progress < 100 && (
                  <ProgressBar progress={progress} />
                )}
                {!(progress > 0 && progress < 100) && (
                  <div className="flex justify-center">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-400" />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <Button
            className="w-full"
            size="lg"
            onClick={handleUpload}
            disabled={!files.length}
          >
            Upload &amp; Generate OTP
          </Button>
        )}
      </div>
    </GlassCard>
  )
}
