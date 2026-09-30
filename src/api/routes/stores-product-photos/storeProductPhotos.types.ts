import type { PhotoProcessingStatus } from '../../common.types'

export type PhotoQuality = 'large' | 'medium' | 'small'

/** Serverda tayyorlangan o'lchamdagi nusxa */
export interface PhotoRendition {
  id: number
  quality: PhotoQuality
  image: string
  created_at: string
}

export interface StoreProductPhoto {
  id: number
  image: string
  original_filename: string
  processing_status: PhotoProcessingStatus
  renditions: PhotoRendition[]
  created_at: string
  updated_at: string
}

/** Rasm faqat FormData orqali yuboriladi: formData.append('image', file) */
export interface StoreProductPhotoRequest {
  image: File | Blob
}

export type StoreProductPhotoUpdateRequest = Partial<StoreProductPhotoRequest>
