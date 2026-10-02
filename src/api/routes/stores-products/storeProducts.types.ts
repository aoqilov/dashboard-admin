import type { StoreProductPhoto } from '../stores-product-photos/storeProductPhotos.types'

/** Mahsulot ichidagi variant (rasmlari bilan) */
export interface ProductVariantRead {
  id: number
  photos: StoreProductPhoto[]
  created_at: string
  updated_at: string
}

export interface ProductVariantWriteRequest {
  /** StoreProductPhoto id lari */
  photos?: number[]
}

/** Narxlar backenddan satr bo'lib keladi: "1450.00" */
export interface StoreProduct {
  id: number
  name: string
  /** StoreCategory id */
  category: number
  subcategory?: number | null
  description?: string
  brand?: string
  manufacture?: string
  material_ids?: number[]
  slug: string
  /** StoreTag id lari */
  tags?: number[]
  /** StoreColor id */
  color?: number | null
  /** Mavjud o'lchamlar: [39, 40, 41] */
  size?: number[] | null
  price_sale?: string | null
  price_rental?: string | null
  price_tailoring?: string | null
  is_sellable?: boolean
  is_rentable?: boolean
  blur_image_in_site?: boolean
  views: number
  in_customers_saved: number
  variants: ProductVariantRead[]
  created_at: string
  updated_at: string
}

export interface StoreProductRequest {
  name: string
  category: number
  subcategory?: number | null
  description?: string
  brand?: string
  manufacture?: string
  material_ids?: number[]
  slug: string
  tags?: number[]
  color?: number | null
  size?: number[]
  price_sale?: string | null
  price_rental?: string | null
  price_tailoring?: string | null
  is_sellable?: boolean
  is_rentable?: boolean
  blur_image_in_site?: boolean
  variants?: ProductVariantWriteRequest[]
}

export type StoreProductUpdateRequest = Partial<StoreProductRequest>
