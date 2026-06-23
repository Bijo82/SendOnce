import type { PreviewResponse, UploadResponse } from '../types/api'

export function normalizeUploadResponse(data: Record<string, unknown>): UploadResponse {
  const otp = (
  data.otp ??
  data.Otp ??
  data.OTP ??
  data.code
) as string
  const expiresIn = (data.expires_in ?? data.expiresIn ?? data.expiry ?? 600) as number

  if (!otp) {
    throw { message: 'Invalid response from server.', status: 500 }
  }

  return { otp: String(otp).toUpperCase(), expires_in: Number(expiresIn) }
}

export function normalizePreviewResponse(data: Record<string, unknown>): PreviewResponse {
  const explicitType = data.type as string | undefined
  const filename = (data.filename ?? data.file_name ?? data.name) as string | undefined
  const size = (data.size ?? data.file_size) as number | undefined
  const preview = (data.preview ?? data.content_preview ?? data.text_preview) as string | undefined

  let type: 'file' | 'text' = 'text'
  if (explicitType === 'file' || explicitType === 'text') {
    type = explicitType
  } else if (filename || data.content_type || data.mime_type) {
    type = 'file'
  }

  return { type, filename, size, preview, content_type: data.content_type as string | undefined }
}
