/** Oddiy email tekshiruvi (backend aniqroq tekshiradi) */
export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** "instagram.com/shop" -> "https://instagram.com/shop" */
export function normalizeUrl(value: string) {
  const url = value.trim()
  if (!url) return ''
  return /^[a-z][a-z\d+.-]*:\/\//i.test(url) ? url : `https://${url}`
}

/** http(s) havolami */
export function isUrl(value: string) {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname.includes('.')
  } catch {
    return false
  }
}
