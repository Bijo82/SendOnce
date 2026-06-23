import type { ApiError } from '../types/api'
import { MAX_FILE_SIZE_BYTES, SUPPORTED_FILE_EXTENSIONS } from './constants'

export function parseApiError(status: number, body: unknown): ApiError {
  let message = 'Something went wrong. Please try again.'

  if (typeof body === 'object' && body !== null) {
    const record = body as Record<string, unknown>
    if (typeof record.error === 'string') message = record.error
    else if (typeof record.message === 'string') message = record.message
    else if (typeof record.detail === 'string') message = record.detail
  } else if (typeof body === 'string' && body.trim()) {
    message = body.trim()
  }

  if (status === 400 && message.toLowerCase().includes('invalid otp')) {
    message = 'Invalid OTP. Please check and try again.'
  } else if (status === 404) {
    message = 'OTP not found or has expired.'
  } else if (status === 400 && message.toLowerCase().includes('already used')) {
    message = 'This OTP has already been used.'
  } else if (status === 400 && message.toLowerCase().includes('too large')) {
    message = 'File exceeds the maximum allowed size.'
  } else if (
  status === 400 &&
  (
    message.toLowerCase().includes('empty file') ||
    message.toLowerCase().includes('file is empty')
  )
) {
  message = 'The selected file is empty.'
} else if (
  status === 400 &&
  (
    message.toLowerCase().includes('empty text') ||
    message.toLowerCase().includes('cannot be empty')
  )
) {
  message = 'Please enter some text before sharing.'
}

  return { message, status }
}

export function getFileValidationError(file: File): string | null {
  if (file.size === 0) return 'The selected file is empty.'
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File "${file.name}" exceeds the 10 MB limit.`
  }

  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
  const supported = SUPPORTED_FILE_EXTENSIONS.some((s) => s === ext)
  if (!supported && ext !== '.') {
    return `File type "${ext}" is not supported.`
  }

  return null
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}
