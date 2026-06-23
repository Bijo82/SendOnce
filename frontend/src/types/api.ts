export interface UploadResponse {
  otp: string
  expires_in: number
  message?: string
}

export interface PreviewResponse {
  type: 'file' | 'text'
  filename?: string
  content_type?: string
  size?: number
  preview?: string
  message?: string
}

export interface TextContentResponse {
  content: string
}

export interface ApiError {
  message: string
  status: number
}

export type UploadPhase =
  | 'idle'
  | 'uploading'
  | 'encrypting'
  | 'generating'
  | 'preparing'
  | 'waking'

export type DownloadPhase =
  | 'idle'
  | 'verifying'
  | 'preparing'
  | 'downloading'
  | 'waking'
