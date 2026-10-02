import { ImageOff } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { cn } from '@/utils/cn'
import { saleDiscount, type DiscountRule } from '@/features/discounts/utils/discountPrice'
import { formatPrice } from '@/utils/format'

/** Mahsulot rasmi yoki bo'sh joy belgisi */
export function ProductImage({ src, className }: { src?: string; className?: string }) {
  return (
    <span className={cn('flex shrink-0 items-center justify-center overflow-hidden bg-hover text-subtle', className)}>
      {src ? <img src={src} alt="" loading="lazy" className="size-full object-cover" /> : <ImageOff className="size-5" />}
    </span>
  )
}

/** Sotuv / Ijara / Tikish belgilari */
export function AvailabilityBadges({ product }: { product: StoreProduct }) {
  const hasBadge = product.is_sellable || product.is_rentable || product.price_tailoring
  if (!hasBadge) return <span className="text-xs text-subtle">—</span>
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.is_sellable && <CusBadge color="success">Sotuv</CusBadge>}
      {product.is_rentable && <CusBadge color="info">Ijara</CusBadge>}
      {product.price_tailoring && <CusBadge color="warning">Tikish</CusBadge>}
    </div>
  )
}

/** Asosiy narx + ikkinchi darajali narx (ijara). Faol chegirma bo'lsa — yangi narx tepada, eski narx qizil va chizilgan */
export function ProductPrice({ product, rules }: { product: StoreProduct; rules?: DiscountRule[] }) {
  const sale = product.is_sellable ? formatPrice(product.price_sale) : null
  const rental = product.is_rentable ? formatPrice(product.price_rental) : null
  const discount = saleDiscount(product, rules)
  if (!sale && !rental) return <span className="text-sm text-subtle">—</span>
  if (discount && sale) {
    return (
      <div className="leading-tight">
        <p className="text-sm font-semibold text-heading">{formatPrice(discount.price)}</p>
        <p className="mt-0.5 text-xs text-danger line-through">{sale}</p>
        {rental && <p className="mt-0.5 text-xs text-muted">ijara {rental}</p>}
      </div>
    )
  }
  return (
    <div className="leading-tight">
      <p className="text-sm font-medium text-heading">{sale ?? rental}</p>
      {sale && rental && <p className="mt-0.5 text-xs text-muted">ijara {rental}</p>}
      {!sale && rental && <p className="mt-0.5 text-xs text-muted">ijara</p>}
    </div>
  )
}
