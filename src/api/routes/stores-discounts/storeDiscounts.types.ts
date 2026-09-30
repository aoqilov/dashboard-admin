import type { ContentStatus } from '../../common.types'

export type DiscountType = 'fixed_amount' | 'percentage'

/** Chegirmadagi bitta mahsulot */
export interface DiscountProduct {
  id: number
  product: number
  discount_type: DiscountType
  /** "15" (foiz) yoki "20000.00" (summa) */
  value: string
  created_at: string
  updated_at: string
}

export interface DiscountProductRequest {
  product: number
  discount_type: DiscountType
  value: string
}

export interface StoreDiscount {
  id: number
  title: string
  description?: string
  starts_at?: string | null
  ends_at?: string | null
  status?: ContentStatus
  products?: DiscountProduct[]
  created_at: string
  updated_at: string
}

export interface StoreDiscountRequest {
  title: string
  description?: string
  starts_at?: string | null
  ends_at?: string | null
  status?: ContentStatus
  products?: DiscountProductRequest[]
}

export type StoreDiscountUpdateRequest = Partial<StoreDiscountRequest>
