import { X } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { ProductImage } from '@/features/products/components/shared/ProductBits'
import { productCover } from '@/features/products/utils/productView'
import { formatPrice } from '@/utils/format'

interface NewsProductListProps {
  ids: number[]
  /** id -> mahsulot */
  products: Map<number, StoreProduct>
  onChange: (ids: number[]) => void
}

/** Yangilikka tanlangan mahsulotlar: rasm, nom, narx, olib tashlash */
export function NewsProductList({ ids, products, onChange }: NewsProductListProps) {
  return (
    <ul className="divide-y divide-border">
      {ids.map((id) => {
        const product = products.get(id)
        return (
          <li key={id} className="flex items-center gap-3 p-3">
            <ProductImage src={product ? productCover(product) : undefined} className="size-10 rounded-control" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-heading">{product?.name ?? `#${id}`}</p>
              <p className="text-xs text-muted">
                {product ? (formatPrice(product.price_sale) ?? formatPrice(product.price_rental) ?? '—') : '—'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Olib tashlash"
              onClick={() => onChange(ids.filter((other) => other !== id))}
              className="flex size-8 shrink-0 items-center justify-center rounded-control text-muted transition-colors hover:bg-hover hover:text-danger"
            >
              <X className="size-4" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}
