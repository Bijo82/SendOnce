import { motion } from 'framer-motion'
import type { PreviewResponse } from '../../types/api'
import { formatBytes } from '../../utils/errors'
import { Button } from '../ui/Button'
import { GlassCard } from '../ui/GlassCard'

interface PreviewCardProps {
  preview: PreviewResponse
  onDownload: () => void
  onOpenText: () => void
  isDownloading: boolean
  downloadPhase: string
}

export function PreviewCard({
  preview,
  onDownload,
  onOpenText,
  isDownloading,
  downloadPhase,
}: PreviewCardProps) {
  const isFile = preview.type === 'file'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard holographic>
        {isFile ? (
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-lg font-medium text-white">
                {preview.filename ?? 'Shared File'}
              </p>
              {preview.size != null && (
                <p className="mt-1 text-sm text-slate-400">{formatBytes(preview.size)}</p>
              )}
              <p className="mt-2 text-sm text-emerald-400">Ready for download</p>
            </div>
            <Button onClick={onDownload} loading={isDownloading} className="shrink-0">
              {isDownloading ? downloadPhase : 'Download File'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-white">Text Ready</p>
              {preview.preview && (
                <p className="mt-2 max-w-md truncate text-sm text-slate-400">
                  {preview.preview}
                </p>
              )}
            </div>
            <Button onClick={onOpenText} loading={isDownloading} className="min-w-[160px]">
              {isDownloading ? downloadPhase : 'Open Content'}
            </Button>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}
