import { isAxiosError } from 'axios'
import type { StoreProductPhoto } from '@/api/routes/stores-product-photos/storeProductPhotos.types'
import type { StoreProduct, StoreProductRequest } from '@/api/routes/stores-products/storeProducts.types'
import { SLUG_PATTERN } from '@/utils/slugify'

/** Variant ichidagi bitta rasm: yuklanayotgan yoki tayyor */
export interface PhotoDraft {
  key: string
  photo?: StoreProductPhoto
  /** Yuklanayotganda lokal ko'rinish (blob:) */
  preview?: string
  error?: string
}

export interface VariantDraft {
  key: string
  photos: PhotoDraft[]
}

/**
 * Forma holati. Inputlar satr bilan ishlaydi — so'rovga toRequest() aylantiradi.
 * category/subcategory/color — id ning satr ko'rinishi ('' — tanlanmagan)
 */
export interface ProductFormValues {
  name: string
  slug: string
  description: string
  category: string
  subcategory: string
  tags: number[]
  brand: string
  manufacture: string
  color: string
  size: string
  material_ids: number[]
  is_sellable: boolean
  is_rentable: boolean
  price_sale: string
  price_rental: string
  price_tailoring: string
  blur_image_in_site: boolean
  variants: VariantDraft[]
}

export type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>

export const uid = () => Math.random().toString(36).slice(2)

export function emptyVariant(): VariantDraft {
  return { key: uid(), photos: [] }
}

/** "1450000.00" -> "1450000" (inputda ortiqcha nollar ko'rinmasin) */
function priceToInput(value: string | null | undefined) {
  if (value === null || value === undefined || value === '') return ''
  const number = Number(value)
  return Number.isFinite(number) ? String(number) : value
}

export function toFormValues(product?: StoreProduct): ProductFormValues {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    category: product?.category ? String(product.category) : '',
    subcategory: product?.subcategory ? String(product.subcategory) : '',
    tags: product?.tags ?? [],
    brand: product?.brand ?? '',
    manufacture: product?.manufacture ?? '',
    color: product?.color ? String(product.color) : '',
    size: product?.size != null ? String(product.size) : '',
    material_ids: product?.material_ids ?? [],
    // Yangi mahsulot default sotiladi
    is_sellable: product?.is_sellable ?? true,
    is_rentable: product?.is_rentable ?? false,
    price_sale: priceToInput(product?.price_sale),
    price_rental: priceToInput(product?.price_rental),
    price_tailoring: priceToInput(product?.price_tailoring),
    blur_image_in_site: product?.blur_image_in_site ?? false,
    variants: product?.variants.length
      ? product.variants.map((variant) => ({
          key: uid(),
          photos: variant.photos.map((photo) => ({ key: uid(), photo })),
        }))
      : [emptyVariant()],
  }
}

/** "1 450 000,5" -> "1450000.5" ; bo'sh -> null */
function normalizePrice(value: string) {
  const clean = value.replace(/\s/g, '').replace(',', '.')
  return clean === '' ? null : clean
}

const isValidPrice = (value: string) => {
  const clean = normalizePrice(value)
  return clean === null || (/^\d+(\.\d{1,2})?$/.test(clean) && Number(clean) >= 0)
}

export function validate(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {}
  if (!values.name.trim()) errors.name = 'Nomini kiriting'
  if (!values.slug.trim()) errors.slug = 'Slug kerak'
  else if (!SLUG_PATTERN.test(values.slug)) errors.slug = "Faqat lotin harflari, raqam, '-' va '_'"
  if (!values.category) errors.category = 'Kategoriyani tanlang'
  if (values.size && !/^\d+$/.test(values.size)) errors.size = 'Butun son kiriting'

  if (values.is_sellable && !normalizePrice(values.price_sale)) errors.price_sale = 'Sotuv narxini kiriting'
  if (values.is_rentable && !normalizePrice(values.price_rental)) errors.price_rental = 'Ijara narxini kiriting'
  for (const key of ['price_sale', 'price_rental', 'price_tailoring'] as const) {
    if (!errors[key] && !isValidPrice(values[key])) errors[key] = "Noto'g'ri narx"
  }
  return errors
}

export function toRequest(values: ProductFormValues): StoreProductRequest {
  return {
    name: values.name.trim(),
    slug: values.slug.trim(),
    description: values.description.trim(),
    category: Number(values.category),
    subcategory: values.subcategory ? Number(values.subcategory) : null,
    tags: values.tags,
    brand: values.brand.trim(),
    manufacture: values.manufacture.trim(),
    color: values.color ? Number(values.color) : null,
    size: values.size ? Number(values.size) : null,
    material_ids: values.material_ids,
    is_sellable: values.is_sellable,
    is_rentable: values.is_rentable,
    // O'chirilgan xizmat narxi yuborilmaydi
    price_sale: values.is_sellable ? normalizePrice(values.price_sale) : null,
    price_rental: values.is_rentable ? normalizePrice(values.price_rental) : null,
    price_tailoring: normalizePrice(values.price_tailoring),
    blur_image_in_site: values.blur_image_in_site,
    variants: values.variants
      .map((variant) => ({ photos: variant.photos.flatMap((item) => (item.photo ? [item.photo.id] : [])) }))
      .filter((variant) => variant.photos.length > 0),
  }
}

/** DRF maydon xatolari: { slug: ["already exists"] } -> { slug: "already exists" } */
export function serverFieldErrors(error: unknown): ProductFormErrors {
  if (!isAxiosError(error) || error.response?.status !== 400) return {}
  const data: unknown = error.response.data
  if (!data || typeof data !== 'object') return {}

  const errors: Record<string, string> = {}
  for (const [key, value] of Object.entries(data)) {
    const message = Array.isArray(value) ? value[0] : value
    if (typeof message === 'string') errors[key] = message
  }
  return errors as ProductFormErrors
}

/** Forma bo'limlariga beriladigan umumiy props */
export interface SectionProps {
  values: ProductFormValues
  errors: ProductFormErrors
  set: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void
}
