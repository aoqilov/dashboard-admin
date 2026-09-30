import type { ContentStatus } from '../../common.types'

export type NewsType = 'event' | 'discount' | 'holiday' | 'other'

export interface StoreNews {
  id: number
  title: string
  news_type: NewsType
  slug: string
  description?: string
  starts_at: string
  ends_at: string
  status?: ContentStatus
  /** Product id lari */
  products?: number[]
  created_at: string
  updated_at: string
}

export interface StoreNewsRequest {
  title: string
  news_type: NewsType
  slug: string
  description?: string
  starts_at: string
  ends_at: string
  status?: ContentStatus
  products?: number[]
}

export type StoreNewsUpdateRequest = Partial<StoreNewsRequest>
