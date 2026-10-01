import { BASE_URL } from '@/api/api-config/axiosInstance'
import type { PhotoQuality, StoreProductPhoto } from '@/api/routes/stores-product-photos/storeProductPhotos.types'

/** Backend nisbiy yo'l ('/media/..') qaytarsa to'liq manzilga aylantiradi */
export function mediaUrl(path: string | null | undefined) {
  if (!path) return undefined
  if (/^(https?:|blob:|data:)/.test(path)) return path
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

/** Kerakli o'lchamdagi nusxa, bo'lmasa asl rasm */
export function photoUrl(photo: StoreProductPhoto | undefined, quality: PhotoQuality = 'medium') {
  if (!photo) return undefined
  const rendition = photo.renditions.find((item) => item.quality === quality)
  return mediaUrl(rendition?.image ?? photo.image)
}
