import type { DiscountType } from '../stores-discounts/storeDiscounts.types'
import type { ProductVariantRead } from '../stores-products/storeProducts.types'

/** Mahsulotga amal qilayotgan chegirma */
export interface PublicProductDiscount {
  id: number
  /** StoreDiscount id */
  discount: number
  title: string
  description: string
  discount_type: DiscountType
  value: string
  starts_at: string
  ends_at: string
}

export interface PublicProduct {
  id: number
  store: number
  name: string
  category: number
  subcategory?: number | null
  description?: string
  brand?: string
  manufacture?: string
  material_ids: number[]
  slug: string
  tags?: number[]
  color?: number | null
  size?: number | null
  price_sale?: string | null
  price_rental?: string | null
  price_tailoring?: string | null
  is_sellable?: boolean
  is_rentable?: boolean
  blur_image_in_site?: boolean
  views: number
  in_customers_saved: number
  variants: ProductVariantRead[]
  discounts: PublicProductDiscount[]
  created_at: string
  updated_at: string
}
