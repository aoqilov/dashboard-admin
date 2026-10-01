import { Banknote, Copy, Ellipsis, Eye, Heart, Pencil, Trash2 } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import type { CategoryTree } from '@/features/categories/utils/categoryTree'
import { formatCompact, formatDate } from '@/utils/format'
import { categoryPath, productCover } from '../../utils/productView'
import { AvailabilityBadges, ProductImage, ProductPrice } from '../shared/ProductBits'

/** ⋯ menyusidagi amallar. Qatorni bosish — edit */
export type ProductAction = 'edit' | 'price' | 'duplicate' | 'delete'

interface ProductTableProps {
  products: StoreProduct[]
  tree?: CategoryTree
  isLoading?: boolean
  emptyText?: string
  onAction: (action: ProductAction, product: StoreProduct) => void
}

export function ProductTable({ products, tree, isLoading, emptyText, onAction }: ProductTableProps) {
  const columns: TableColumn<StoreProduct>[] = [
    {
      key: 'name',
      header: 'Mahsulot',
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
    { key: 'price', header: 'Narx', render: (product) => <ProductPrice product={product} /> },
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
      render: (product) => (
        // Qator bosilishi (ochish) menyuga o'tmasin
        <div onClick={(event) => event.stopPropagation()}>
          <CusMenu
            trigger={<CusIconButton icon={Ellipsis} label="Amallar" size="sm" />}
            items={[
              { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
              { value: 'price', label: "Narxni o'zgartirish", icon: <Banknote className="size-4" /> },
              { value: 'duplicate', label: 'Nusxa olish', icon: <Copy className="size-4" /> },
              { separator: true },
              { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
            ]}
            onSelect={(value) => onAction(value as ProductAction, product)}
          />
        </div>
      ),
    },
  ]

  return (
    <CusTable
      columns={columns}
      data={products}
      rowKey={(product) => product.id}
      onRowClick={(product) => onAction('edit', product)}
      isLoading={isLoading}
      emptyText={emptyText}
    />
  )
}
