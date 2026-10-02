import { Check, Eye, Heart } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import type { CategoryTree } from '@/features/categories/utils/categoryTree'
import { useDiscountRules } from '@/features/discounts/api-hooks/useDiscounts'
import { cn } from '@/utils/cn'
import { formatCompact, formatDate } from '@/utils/format'
import type { ProductLayout } from '../../utils/productLayout'
import { categoryPath, productCover } from '../../utils/productView'
import { ProductActionsMenu, type ProductAction } from '../shared/ProductActionsMenu'
import { AvailabilityBadges, ProductImage, ProductPrice } from '../shared/ProductBits'

type GridLayout = Exclude<ProductLayout, 'table'>

/** Ustunlar soni ekran kengligiga qarab kamayadi; eng keng ekranda 12 / 8 / 6 / 4 */
const COLUMNS: Record<GridLayout, string> = {
  grid12: 'grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12',
  grid8: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8',
  grid6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6',
  grid4: 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-4',
}

interface ProductGridProps {
  products: StoreProduct[]
  tree?: CategoryTree
  layout: GridLayout
  isLoading?: boolean
  onAction: (action: ProductAction, product: StoreProduct) => void
  /** Chegirma uchun tanlash rejimi: kartani bosish — tanlash/bekor qilish */
  selection?: { ids: Set<number>; onToggle: (product: StoreProduct) => void }
}

/** Mahsulotlar to'ri. Asosiy rasm doim 3:4 nisbatda */
export function ProductGrid({ products, tree, layout, isLoading, onAction, selection }: ProductGridProps) {
  const { data: rules } = useDiscountRules()
  const horizontal = layout === 'grid4'
  const compact = layout === 'grid12'

  if (isLoading) {
    return (
      <div className={cn('grid gap-4', COLUMNS[layout])}>
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="aspect-3/4 animate-pulse rounded-card bg-hover" />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4', COLUMNS[layout])}>
      {products.map((product) => {
        const isOn = selection?.ids.has(product.id)
        const open = () => (selection ? selection.onToggle(product) : onAction('view', product))

        return (
          <div
            key={product.id}
            role="button"
            tabIndex={0}
            onClick={open}
            onKeyDown={(event) => event.key === 'Enter' && open()}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-card bg-surface shadow-card outline-2 -outline-offset-2 transition-shadow hover:shadow-md',
              horizontal ? 'flex gap-3 p-3' : 'flex flex-col',
              isOn ? 'outline-primary' : 'outline-transparent',
            )}
          >
            <div className={cn('relative shrink-0', horizontal && 'w-28 sm:w-32')}>
              <ProductImage
                src={productCover(product, 'medium')}
                className={cn('aspect-3/4 w-full', horizontal && 'rounded-control')}
              />
              {selection && (
                <span
                  className={cn(
                    'absolute top-2 left-2 flex size-5 items-center justify-center rounded border bg-surface/90',
                    isOn ? 'border-primary bg-primary text-white' : 'border-border-strong',
                  )}
                >
                  {isOn && <Check className="size-3.5" />}
                </span>
              )}
              {!selection && !horizontal && (
                <div className="absolute top-1.5 right-1.5 rounded-full bg-surface/90 shadow-xs">
                  <ProductActionsMenu product={product} onAction={onAction} />
                </div>
              )}
            </div>

            <div className={cn('min-w-0 flex-1', horizontal ? 'flex flex-col gap-1.5 py-0.5' : compact ? 'flex flex-col gap-0.5 p-1.5' : 'flex flex-col gap-1 p-2.5')}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={cn('truncate font-medium text-heading', compact ? 'text-xs' : 'text-sm')} title={product.name}>
                    {product.name}
                  </p>
                  {horizontal && <p className="truncate text-xs text-subtle">/{product.slug}</p>}
                </div>
                {!selection && horizontal && <ProductActionsMenu product={product} onAction={onAction} />}
              </div>

              {layout !== 'grid8' && !compact && (
                <p className="truncate text-xs text-muted">{categoryPath(product, tree) || '—'}</p>
              )}

              <div className={cn('break-words', compact && '[&_p]:text-2xs')}>
                <ProductPrice product={product} rules={rules?.get(product.id)} />
              </div>

              {horizontal && (
                <>
                  <AvailabilityBadges product={product} />
                  <div className="mt-auto flex items-center gap-3 pt-1 text-xs text-muted">
                    <span className="flex items-center gap-1" title="Ko'rishlar">
                      <Eye className="size-3.5" /> {formatCompact(product.views)}
                    </span>
                    <span className="flex items-center gap-1" title="Saqlaganlar">
                      <Heart className="size-3.5" /> {formatCompact(product.in_customers_saved)}
                    </span>
                    <span className="ml-auto">{formatDate(product.updated_at)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
