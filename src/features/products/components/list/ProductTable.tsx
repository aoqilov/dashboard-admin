import { Check, Eye, Heart } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import type { CategoryTree } from '@/features/categories/utils/categoryTree'
import { useDiscountRules } from '@/features/discounts/api-hooks/useDiscounts'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { cn } from '@/utils/cn'
import { formatCompact, formatDate } from '@/utils/format'
import { categoryPath, productCover } from '../../utils/productView'
import { ProductActionsMenu, type ProductAction } from '../shared/ProductActionsMenu'
import { AvailabilityBadges, ProductImage, ProductPrice } from '../shared/ProductBits'

interface ProductTableProps {
  products: StoreProduct[]
  tree?: CategoryTree
  isLoading?: boolean
  emptyText?: string
  onAction: (action: ProductAction, product: StoreProduct) => void
  /** Chegirma uchun tanlash rejimi: qatorni bosish — tanlash/bekor qilish */
  selection?: { ids: Set<number>; onToggle: (product: StoreProduct) => void }
}

export function ProductTable({ products, tree, isLoading, emptyText, onAction, selection }: ProductTableProps) {
  const { data: rules } = useDiscountRules()

  const selectColumn: TableColumn<StoreProduct> = {
    key: 'select',
    header: '',
    width: '48px',
    skeleton: <CusSkeleton height="5" width="5" />,
    render: (product) => {
      const isOn = selection?.ids.has(product.id)
      return (
        <span
          className={cn(
            'flex size-5 items-center justify-center rounded border',
            isOn ? 'border-primary bg-primary text-white' : 'border-border-strong',
          )}
        >
          {isOn && <Check className="size-3.5" />}
        </span>
      )
    },
  }

  const columns: TableColumn<StoreProduct>[] = [
    ...(selection ? [selectColumn] : []),
    {
      key: 'name',
      header: 'Mahsulot',
      skeleton: (
        <div className="flex min-w-55 items-center gap-3">
          <CusSkeleton height="11" width="11" />
          <div className="flex flex-1 flex-col gap-2">
            <CusSkeleton height="3.5" width="60%" />
            <CusSkeleton height="3" width="35%" />
          </div>
        </div>
      ),
      render: (product) => (
        <div className="flex min-w-55 items-center gap-3">
          <ProductImage src={productCover(product)} className="size-11 rounded-control" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-heading">{product.name}</p>
            <p className="truncate text-xs text-subtle">/{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategoriya',
      render: (product) => <span className="text-sm text-content">{categoryPath(product, tree) || '—'}</span>,
    },
    { key: 'price', header: 'Narx', render: (product) => <ProductPrice product={product} rules={rules?.get(product.id)} /> },
    { key: 'status', header: 'Xizmatlar', render: (product) => <AvailabilityBadges product={product} /> },
    {
      key: 'stats',
      header: 'Qiziqish',
      render: (product) => (
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1" title="Ko'rishlar">
            <Eye className="size-3.5" /> {formatCompact(product.views)}
          </span>
          <span className="flex items-center gap-1" title="Saqlaganlar">
            <Heart className="size-3.5" /> {formatCompact(product.in_customers_saved)}
          </span>
        </div>
      ),
    },
    {
      key: 'updated_at',
      header: 'Yangilangan',
      render: (product) => <span className="text-xs text-muted">{formatDate(product.updated_at)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'end',
      width: '56px',
      render: (product) => <ProductActionsMenu product={product} onAction={onAction} />,
    },
  ]

  return (
    <CusTable
      columns={selection ? columns.filter((column) => column.key !== 'actions') : columns}
      data={products}
      rowKey={(product) => product.id}
      onRowClick={(product) => (selection ? selection.onToggle(product) : onAction('view', product))}
      isLoading={isLoading}
      emptyText={emptyText}
    />
  )
}
