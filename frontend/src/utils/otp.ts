import { OTP_LENGTH } from './constants'

export function normalizeOtp(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, OTP_LENGTH)
}

export function isValidOtp(value: string): boolean {
  return value.length === OTP_LENGTH && /^[A-Z0-9]{6}$/.test(value)
}

export function getShareUrl(otp: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}/share/${otp}`
}
