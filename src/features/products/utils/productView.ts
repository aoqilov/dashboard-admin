import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import type { CategoryTree } from '@/features/categories/utils/categoryTree'
import { photoUrl } from '@/utils/media'

/** Muqova: birinchi variantning birinchi rasmi */
export function productCover(product: StoreProduct, quality: 'small' | 'medium' | 'large' = 'small') {
  const photo = product.variants.find((variant) => variant.photos.length)?.photos[0]
  return photoUrl(photo, quality)
}

/** "Ko'ylaklar › Kechki" */
export function categoryPath(product: StoreProduct, tree: CategoryTree | undefined) {
  const category = tree?.byId.get(product.category)?.name
  const sub = product.subcategory ? tree?.byId.get(product.subcategory)?.name : undefined
  return [category, sub].filter(Boolean).join(' › ')
}
