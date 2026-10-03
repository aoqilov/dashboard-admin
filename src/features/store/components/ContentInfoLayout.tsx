import { useState, type ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialog } from '@/components/ui/dialog/CusDialog'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { ProductGrid } from '@/features/products/components/list/ProductGrid'
import { ProductImage } from '@/features/products/components/shared/ProductBits'
import { ProductFormModal } from '@/features/products/modals/ProductFormModal'
import { ProductInfoModal } from '@/features/products/modals/ProductInfoModal'

interface ContentInfoLayoutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  image?: string
  /** Rasm ostidagi belgilar (holat, tur) */
  badges?: ReactNode
  /** Chap kartadagi "nomi — qiymati" qatorlari */
  details: { label: string; value: ReactNode }[]
  products: StoreProduct[]
  productsLoading?: boolean
  /** Mahsulot kartasi rasmi ustidagi belgi (masalan chegirma foizi) */
  productOverlay?: (product: StoreProduct) => ReactNode
  onEdit: () => void
}

/**
 * Chegirma/yangilik ma'lumot modali: chapda ma'lumotlar kartasi, o'ngda 8 ustunli mahsulotlar to'ri.
 * Mahsulot bosilsa — ProductInfoModal, undagi "Tahrirlash" — ProductFormModal.
 */
export function ContentInfoLayout({
  open,
  onOpenChange,
  title,
  description,
  image,
  badges,
  details,
  products,
  productsLoading,
  productOverlay,
  onEdit,
}: ContentInfoLayoutProps) {
  const { data: tree } = useCategories()
  const [viewing, setViewing] = useState<StoreProduct | null>(null)
  const [editing, setEditing] = useState<StoreProduct | null>(null)

  return (
    <>
      <CusDialog
        open={open}
        onOpenChange={onOpenChange}
        size="full"
        scrollBehavior="inside"
        title={title}
        footer={
          <CusButton leftIcon={<Pencil />} onClick={onEdit}>
            Tahrirlash
          </CusButton>
        }
      >
        <div className="grid items-stretch gap-6 lg:h-[calc(100vh-11rem)] lg:grid-cols-[300px_1fr]">
          <div className="flex flex-col gap-4 self-center rounded-card border border-border p-4">
            <ProductImage src={image} className="aspect-video w-full rounded-control" />
            {badges && <div className="flex flex-wrap items-center gap-1.5">{badges}</div>}
            {description && <p className="text-sm text-content">{description}</p>}
            <dl className="flex flex-col divide-y divide-border">
              {details.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right text-heading">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex min-h-0 flex-col gap-3 overflow-y-auto rounded-card border border-border p-4">
            <p className="text-sm font-medium text-heading">Mahsulotlar ({products.length})</p>
            {!productsLoading && products.length === 0 ? (
              <CusEmptyState size="sm" title="Mahsulot tanlanmagan" />
            ) : (
              <ProductGrid
                products={products}
                tree={tree}
                layout="grid8"
                columnsClassName="grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8"
                isLoading={productsLoading}
                hideActions
                overlay={productOverlay}
                onAction={(_, product) => setViewing(product)}
              />
            )}
          </div>
        </div>
      </CusDialog>

      {viewing && (
        <ProductInfoModal
          product={viewing}
          open
          onOpenChange={(next) => !next && setViewing(null)}
          onEdit={(product) => {
            setViewing(null)
            setEditing(product)
          }}
        />
      )}
      {editing && <ProductFormModal open onOpenChange={(next) => !next && setEditing(null)} product={editing} />}
    </>
  )
}
