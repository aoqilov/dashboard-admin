import { Eye, Heart } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import type { CategoryTree } from '@/features/categories/utils/categoryTree'
import { formatCompact } from '@/utils/format'
import { categoryPath, productCover } from '../../utils/productView'
import { AvailabilityBadges, ProductImage, ProductPrice } from '../shared/ProductBits'

interface ProductGridProps {
  products: StoreProduct[]
  tree?: CategoryTree
  isLoading?: boolean
  onOpen: (product: StoreProduct) => void
}

const GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'

/** Rasmga qarab topish uchun kartalar */
export function ProductGrid({ products, tree, isLoading, onOpen }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={GRID}>
        {Array.from({ length: 10 }, (_, index) => (
          <CusSkeleton key={index} height="340px" />
        ))}
      </div>
    )
  }

  return (
    <div className={GRID}>
      {products.map((product) => (
        <button
          key={product.id}
          type="button"
          onClick={() => onOpen(product)}
          className="group flex flex-col overflow-hidden rounded-card bg-surface text-left shadow-card transition-shadow hover:shadow-lg focus-visible:shadow-focus focus-visible:outline-none"
        >
          <ProductImage
            src={productCover(product, 'medium')}
            className="aspect-[3/4] w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="flex flex-1 flex-col gap-2 p-3.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-heading">{product.name}</p>
              <p className="truncate text-xs text-muted">{categoryPath(product, tree) || '—'}</p>
            </div>
            <ProductPrice product={product} />
            <div className="mt-auto flex items-center justify-between gap-2 pt-1">
              <AvailabilityBadges product={product} />
              <span className="flex shrink-0 items-center gap-2 text-2xs text-muted">
                <span className="flex items-center gap-0.5">
                  <Eye className="size-3" /> {formatCompact(product.views)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Heart className="size-3" /> {formatCompact(product.in_customers_saved)}
                </span>
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
