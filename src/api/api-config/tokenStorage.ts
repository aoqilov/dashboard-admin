import type { TokenPair } from '../common.types'

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'

// localStorage private rejimda yopiq bo'lishi mumkin — shuning uchun try/catch

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_KEY)
  } catch {
    return null
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_KEY)
  } catch {
    return null
  }
}

export function saveTokens(tokens: TokenPair) {
  try {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  } catch {
    // saqlab bo'lmasa sessiya faqat shu sahifada ishlaydi
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  } catch {
    // e'tiborsiz
  }
}
