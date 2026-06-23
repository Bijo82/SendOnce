import {
  API_BASE_URL,
  COLD_START_THRESHOLD_MS,
} from '../utils/constants'
import type {
  PreviewResponse,
  TextContentResponse,
  UploadResponse,
} from '../types/api'
import { parseApiError } from '../utils/errors'
import { normalizePreviewResponse, normalizeUploadResponse } from '../utils/normalize'

type ColdStartCallback = (isColdStart: boolean) => void

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  if (!text) return {} as T
  try {
    return JSON.parse(text) as T
  } catch {
    throw parseApiError(response.status, text)
  }
}

async function fetchWithColdStart(
  url: string,
  options: RequestInit,
  onColdStart?: ColdStartCallback,
): Promise<UploadResponse> {
  const start = Date.now()
  let coldStartNotified = false

  const coldStartTimer = window.setTimeout(() => {
    coldStartNotified = true
    onColdStart?.(true)
  }, COLD_START_THRESHOLD_MS)

  try {
    const response = await fetch(url, options)
    window.clearTimeout(coldStartTimer)

    if (!coldStartNotified && Date.now() - start >= COLD_START_THRESHOLD_MS) {
      onColdStart?.(true)
    }

    if (!response.ok) {
      const body = await response.text()
      let parsed: unknown = body
      try {
        parsed = JSON.parse(body)
      } catch {
        /* keep as text */
      }
      throw parseApiError(response.status, parsed)
    }

    const data = await parseJsonResponse<Record<string, unknown>>(response)
    return normalizeUploadResponse(data)
  } catch (error) {
    window.clearTimeout(coldStartTimer)
    throw error
  }
}

async function fetchPreviewWithColdStart(
  url: string,
  onColdStart?: ColdStartCallback,
): Promise<PreviewResponse> {
  const start = Date.now()
  let coldStartNotified = false

  const coldStartTimer = window.setTimeout(() => {
    coldStartNotified = true
    onColdStart?.(true)
  }, COLD_START_THRESHOLD_MS)

  try {
    const response = await fetch(url)
    window.clearTimeout(coldStartTimer)

    if (!coldStartNotified && Date.now() - start >= COLD_START_THRESHOLD_MS) {
      onColdStart?.(true)
    }

    if (!response.ok) {
      const body = await response.text()
      let parsed: unknown = body
      try {
        parsed = JSON.parse(body)
      } catch {
        /* keep as text */
      }
      throw parseApiError(response.status, parsed)
    }

    const data = await parseJsonResponse<Record<string, unknown>>(response)
    return normalizePreviewResponse(data)
  } catch (error) {
    window.clearTimeout(coldStartTimer)
    throw error
  }
}

export function uploadFile(
  files: File[],
  onProgress?: (percent: number) => void,
  onColdStart?: ColdStartCallback,
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    files.forEach((file) => formData.append('uploaded_file', file))

    const start = Date.now()
    let coldStartNotified = false
    const coldStartTimer = window.setTimeout(() => {
      coldStartNotified = true
      onColdStart?.(true)
    }, COLD_START_THRESHOLD_MS)

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100))
      }
    })

    xhr.addEventListener('load', () => {
      window.clearTimeout(coldStartTimer)
      if (!coldStartNotified && Date.now() - start >= COLD_START_THRESHOLD_MS) {
        onColdStart?.(true)
      }

      let body: unknown
      try {
        body = JSON.parse(xhr.responseText)
      } catch {
        body = xhr.responseText
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(normalizeUploadResponse(body as Record<string, unknown>))
      } else {
        reject(parseApiError(xhr.status, body))
      }
    })

    xhr.addEventListener('error', () => {
      window.clearTimeout(coldStartTimer)
      reject(parseApiError(0, 'Network error. Please check your connection.'))
    })

    xhr.addEventListener('abort', () => {
      window.clearTimeout(coldStartTimer)
      reject(parseApiError(0, 'Upload was cancelled.'))
    })

    xhr.open('POST', `${API_BASE_URL}/uploadfile`)
    xhr.send(formData)
  })
}

export function uploadText(
  text: string,
  onColdStart?: ColdStartCallback,
): Promise<UploadResponse> {
  return fetchWithColdStart(
    `${API_BASE_URL}/uploadtext`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    },
    onColdStart,
  )
}

export function previewContent(
  otp: string,
  onColdStart?: ColdStartCallback,
): Promise<PreviewResponse> {
  return fetchPreviewWithColdStart(
    `${API_BASE_URL}/preview?otp=${encodeURIComponent(otp)}`,
    onColdStart,
  )
}

export async function downloadContent(
  otp: string,
  onColdStart?: ColdStartCallback,
): Promise<{ type: 'file' | 'text'; data: Blob; filename?: string; text?: string }> {
  const start = Date.now()
  let coldStartNotified = false

  const coldStartTimer = window.setTimeout(() => {
    coldStartNotified = true
    onColdStart?.(true)
  }, COLD_START_THRESHOLD_MS)

  try {
    const response = await fetch(
      `${API_BASE_URL}/download?otp=${encodeURIComponent(otp)}`,
    )
    window.clearTimeout(coldStartTimer)

    if (!coldStartNotified && Date.now() - start >= COLD_START_THRESHOLD_MS) {
      onColdStart?.(true)
    }

    if (!response.ok) {
      const body = await response.text()
      let parsed: unknown = body
      try {
        parsed = JSON.parse(body)
      } catch {
        /* keep as text */
      }
      throw parseApiError(response.status, parsed)
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) {
      const json = (await response.json()) as TextContentResponse
      const content = json.content ?? (json as unknown as Record<string, string>).text ?? ''
      return {
        type: 'text',
        data: new Blob([content], { type: 'text/plain' }),
        text: content,
      }
    }

    const blob = await response.blob()
    const disposition = response.headers.get('content-disposition') ?? ''
    const filenameMatch = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]*)\1/)
    const filename = filenameMatch?.[2] ?? undefined

    const isTextFile =
      contentType.includes('text/plain') ||
      filename?.toLowerCase().endsWith('.txt')

    if (isTextFile) {
      const text = await blob.text()
      return { type: 'text', data: blob, filename, text }
    }

    return { type: 'file', data: blob, filename }
  } catch (error) {
    window.clearTimeout(coldStartTimer)
    throw error
  }
}

export function triggerFileDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
