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
