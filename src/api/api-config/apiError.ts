import { isAxiosError } from 'axios'

/**
 * Xatodan foydalanuvchiga ko'rsatiladigan matn.
 * Backend (DRF) javoblari: { detail: "..." } yoki { field: ["xato"] }
 */
export function getErrorMessage(error: unknown, fallback = "Xatolik yuz berdi. Qaytadan urinib ko'ring") {
  if (!isAxiosError(error)) return error instanceof Error ? error.message : fallback
  if (!error.response) return "Server bilan aloqa yo'q"

  const data: unknown = error.response.data
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    if ('detail' in data && typeof data.detail === 'string') return data.detail
    // Birinchi maydon xatosi: { phone: ["Noto'g'ri raqam"] }
    const first = Object.values(data)[0]
    if (Array.isArray(first) && typeof first[0] === 'string') return first[0]
    if (typeof first === 'string') return first
  }
  return fallback
}

/** DRF maydon xatolari (400): { slug: ["already exists"] } -> { slug: "already exists" } */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isAxiosError(error) || error.response?.status !== 400) return {}
  const data: unknown = error.response.data
  if (!data || typeof data !== 'object') return {}

  const errors: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    const message = Array.isArray(value) ? value[0] : value
    if (typeof message === 'string') errors[key] = message
  }
  return errors
}
