import type { PhotoProcessingStatus } from '../../common.types'

/** Kategoriya. `parent` bo'lsa — subkategoriya */
export interface StoreCategory {
  id: number
  name: string
  parent?: number | null
  cover?: string | null
  cover_processed: string | null
  cover_processing_status: PhotoProcessingStatus | null
  created_at: string
  updated_at: string
}

/** Muqova (cover) yuborilsa — FormData */
export interface StoreCategoryRequest {
  name: string
  parent?: number | null
  cover?: File | Blob | null
}

export type StoreCategoryUpdateRequest = Partial<StoreCategoryRequest>
