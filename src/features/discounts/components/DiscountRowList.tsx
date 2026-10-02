import { X } from 'lucide-react'
import type { DiscountType } from '@/api/routes/stores-discounts/storeDiscounts.types'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { ProductImage } from '@/features/products/components/shared/ProductBits'
import { productCover } from '@/features/products/utils/productView'
import { formatPrice } from '@/utils/format'
import type { DiscountRow } from '../utils/discountDraft'
import { applyDiscount, DISCOUNT_TYPES, parseDiscountValue } from '../utils/discountPrice'

interface DiscountRowListProps {
  rows: DiscountRow[]
  /** id (satr) -> mahsulot */
  products: Map<string, StoreProduct>
  onChange: (rows: DiscountRow[]) => void
}

/** Tanlangan mahsulotlar: rasm, nom, eski/yangi narx, chegirma turi va qiymati, olib tashlash */
export function DiscountRowList({ rows, products, onChange }: DiscountRowListProps) {
  const patch = (id: string, change: Partial<DiscountRow>) =>
    onChange(rows.map((row) => (row.product === id ? { ...row, ...change } : row)))

  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => {
        const product = products.get(row.product)
        const price = product?.price_sale ? Number(product.price_sale) : null
        const value = parseDiscountValue(row.value)
        const valid = price !== null && Number.isFinite(value) && value > 0
        return (
          <li key={row.product} className="flex flex-col gap-2 p-3">
            <div className="flex items-center gap-3">
              <ProductImage src={product ? productCover(product) : undefined} className="size-10 rounded-control" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-heading">{product?.name ?? `#${row.product}`}</p>
                {valid ? (
                  <p className="text-xs">
                    <span className="font-semibold text-heading">
                      {formatPrice(applyDiscount(price, { type: row.type, value }))}
                    </span>{' '}
                    <span className="text-danger line-through">{formatPrice(price)}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted">{formatPrice(price) ?? 'narxsiz'}</p>
                )}
              </div>
              <button
                type="button"
                aria-label="Olib tashlash"
                onClick={() => onChange(rows.filter((other) => other.product !== row.product))}
                className="flex size-8 shrink-0 items-center justify-center rounded-control text-muted transition-colors hover:bg-hover hover:text-danger"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <CusSelect
                size="md"
                options={DISCOUNT_TYPES}
                value={[row.type]}
                onChange={([next]) => patch(row.product, { type: (next ?? 'percentage') as DiscountType })}
              />
              <CusInput
                inputMode="decimal"
                placeholder={row.type === 'percentage' ? '15' : '20000'}
                value={row.value}
                onChange={(event) => patch(row.product, { value: event.target.value })}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
