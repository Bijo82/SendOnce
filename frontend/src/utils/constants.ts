export const API_BASE_URL = 'https://file-sharing-project-opcq.onrender.com'

export const OTP_LENGTH = 6

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const MAX_TEXT_LENGTH = 500_000

export const COLD_START_THRESHOLD_MS = 8000

export const SUPPORTED_FILE_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.zip',
  '.json',
  '.csv',
  '.xlsx',
  '.xls',
  '.mp4',
  '.mp3',
  '.svg',
  '.md',
] as const

export const UPLOAD_MESSAGES = [
  'Uploading...',
  'Encrypting...',
  'Generating OTP...',
  'Preparing Share...',
] as const

export const DOWNLOAD_MESSAGES = [
  'Verifying OTP...',
  'Preparing Content...',
  'Starting Download...',
] as const
