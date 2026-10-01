import { Eye, Heart, Trash2 } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { formatCompact, formatDate, formatPrice } from '@/utils/format'
import { photoUrl } from '@/utils/media'
import type { PhotoDraft, ProductFormValues } from '../../utils/productForm'
import { ProductImage } from '../shared/ProductBits'

interface ProductSummaryProps {
  values: ProductFormValues
  /** Tahrirlashda — statistika va o'chirish */
  product?: StoreProduct
  onDelete?: () => void
}

function coverSrc(item: PhotoDraft | undefined) {
  if (!item) return undefined
  if (item.photo?.processing_status === 'ready') return photoUrl(item.photo, 'medium')
  return item.preview ?? photoUrl(item.photo, 'medium')
}

/** Saytda qanday ko'rinishi — forma to'ldirilgan sari yangilanadi */
export function ProductSummary({ values, product, onDelete }: ProductSummaryProps) {
  const { data: tree } = useCategories()
  const cover = values.variants.flatMap((variant) => variant.photos)[0]
  const category = tree?.byId.get(Number(values.category))?.name
  const sub = tree?.byId.get(Number(values.subcategory))?.name
  const price = values.is_sellable ? formatPrice(values.price_sale) : null
  const rental = values.is_rentable ? formatPrice(values.price_rental) : null

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--spacing-header)+24px)]">
      <CusCard className="overflow-hidden p-0 sm:p-0">
        <ProductImage src={coverSrc(cover)} className="aspect-[4/5] w-full" />
        <div className="flex flex-col gap-2 p-5">
          <p className="text-xs text-muted">{[category, sub].filter(Boolean).join(' › ') || 'Kategoriya tanlanmagan'}</p>
          <p className="text-base font-semibold break-words text-heading">{values.name || 'Mahsulot nomi'}</p>
          {(price || rental) && (
            <div>
              {price && <p className="text-lg font-semibold text-heading">{price}</p>}
              {rental && <p className="text-sm text-muted">Ijara: {rental}</p>}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {values.is_sellable && <CusBadge color="success">Sotuv</CusBadge>}
            {values.is_rentable && <CusBadge color="info">Ijara</CusBadge>}
            {values.price_tailoring && <CusBadge color="warning">Tikish</CusBadge>}
            {values.blur_image_in_site && <CusBadge color="dark">Rasm xira</CusBadge>}
          </div>
        </div>
      </CusCard>

      {product && (
        <CusCard className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-control bg-hover p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Eye className="size-3.5" /> Ko'rishlar
              </p>
              <p className="mt-1 text-lg font-semibold text-heading">{formatCompact(product.views)}</p>
            </div>
            <div className="rounded-control bg-hover p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <Heart className="size-3.5" /> Saqlaganlar
              </p>
              <p className="mt-1 text-lg font-semibold text-heading">{formatCompact(product.in_customers_saved)}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
            <dt className="text-muted">Yaratilgan</dt>
            <dd className="text-right text-content">{formatDate(product.created_at)}</dd>
            <dt className="text-muted">Yangilangan</dt>
            <dd className="text-right text-content">{formatDate(product.updated_at)}</dd>
          </dl>
          <CusButton variant="ghost" size="sm" leftIcon={<Trash2 />} className="text-danger hover:text-danger" onClick={onDelete}>
            Mahsulotni o'chirish
          </CusButton>
        </CusCard>
      )}
    </div>
  )
}
