import type { ContentStatus } from '../../common.types'
import type { NewsType } from '../stores-news/storeNews.types'

export interface PublicStoreNews {
  id: number
  store: number
  title: string
  news_type: NewsType
  slug: string
  description?: string
  starts_at: string
  ends_at: string
  status?: ContentStatus
  products?: number[]
  created_at: string
  updated_at: string
}
