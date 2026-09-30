export interface StoreProductVariant {
  id: number
  /** Product id */
  product: number
  /** StoreProductPhoto id lari */
  photos?: number[]
  created_at: string
  updated_at: string
}

export interface StoreProductVariantRequest {
  product: number
  photos?: number[]
}

export type StoreProductVariantUpdateRequest = Partial<StoreProductVariantRequest>
