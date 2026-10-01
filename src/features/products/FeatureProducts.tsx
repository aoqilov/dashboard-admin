import { useEffect, useRef, useState } from 'react'
import { Package, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { CusPagination } from '@/components/ui/table/CusPagination'
import { toaster } from '@/components/ui/toaster/toaster'
import { useColors } from '@/features/catalog/api-hooks/useCatalog'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { cn } from '@/utils/cn'
import { useProductMutations, useProducts } from './api-hooks/useProducts'
import { ActiveFilterChips } from './components/list/ActiveFilterChips'
import { ProductTable, type ProductAction } from './components/list/ProductTable'
import { ProductFilterDrawer } from './modals/ProductFilterDrawer'
import { ProductFormModal } from './modals/ProductFormModal'
import { ProductPriceModal } from './modals/ProductPriceModal'
import { PAGE_SIZE, useProductFilters, type FilterKey } from './utils/useProductFilters'

const MODE_OPTIONS = [
  { label: 'Barcha xizmatlar', value: 'all' },
  { label: 'Sotuvda', value: 'sale' },
  { label: 'Ijarada', value: 'rent' },
]

/** Forma modali: bo'sh — yangi, product — tahrirlash, source — nusxa */
type FormState = { product?: StoreProduct; source?: StoreProduct }

export default function FeatureProducts() {
  const { filters, page, body, update, clear, activeCount, advancedCount } = useProductFilters()
  const { data, isLoading, isFetching } = useProducts(body)
  const { data: tree } = useCategories()
  const { data: colors = [] } = useColors()
  const { remove } = useProductMutations()

  const [search, setSearch] = useState(filters.q)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState<FormState | null>(null)
  const [pricing, setPricing] = useState<StoreProduct | null>(null)
  const [toDelete, setToDelete] = useState<StoreProduct | null>(null)

  // Qidiruv: yozib bo'lgandan keyin 350ms kutib so'rov yuboriladi
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const handleSearch = (value: string) => {
    setSearch(value)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => update({ q: value }), 350)
  }
  const resetSearch = () => {
    clearTimeout(searchTimer.current)
    setSearch('')
  }
  useEffect(() => () => clearTimeout(searchTimer.current), [])

  const products = data?.items ?? []
  const roots = tree?.roots ?? []
  const subcategories = filters.category ? (tree?.childrenOf.get(Number(filters.category)) ?? []) : []
  const hasFilters = activeCount > 0

  const handleAction = (action: ProductAction, product: StoreProduct) => {
    if (action === 'edit') setForm({ product })
    if (action === 'price') setPricing(product)
    if (action === 'duplicate') setForm({ source: product })
    if (action === 'delete') setToDelete(product)
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await remove.mutateAsync(toDelete.id)
      toaster.create({ type: 'success', title: `"${toDelete.name}" o'chirildi` })
      setToDelete(null)
    } catch (err) {
      toaster.create({ type: 'error', title: getErrorMessage(err) })
    }
  }

  const removeFilters = (keys: FilterKey[]) => {
    if (keys.includes('q')) resetSearch()
    update(Object.fromEntries(keys.map((key) => [key, ''])))
  }

  const clearFilters = () => {
    resetSearch()
    clear()
  }

  const newButton = (
    <CusButton leftIcon={<Plus />} onClick={() => setForm({})}>
      Mahsulot qo'shish
    </CusButton>
  )

  const isEmpty = !isLoading && products.length === 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mahsulotlar"
        description={data ? `Jami ${data.total} ta mahsulot` : "Do'kondagi barcha mahsulotlar"}
        actions={newButton}
      />

      <CusCard className="flex flex-col gap-4 p-4 sm:p-4">
        {/* Asboblar paneli */}
        <div className="flex flex-wrap items-center gap-3">
          <CusInput
            className="min-w-55 flex-1"
            leftIcon={<Search className="size-4" />}
            placeholder="Nomi bo'yicha qidirish"
            value={search}
            onChange={(event) => handleSearch(event.target.value)}
          />
          <CusSelect
            className="w-full sm:w-44"
            size="md"
            placeholder="Kategoriya"
            clearable
            options={roots.map((c) => ({ label: c.name, value: String(c.id) }))}
            value={filters.category ? [filters.category] : []}
            onChange={([value]) => update({ category: value ?? '', subcategory: '' })}
          />
          <CusSelect
            className="w-full sm:w-44"
            size="md"
            placeholder="Subkategoriya"
            clearable
            isDisabled={!filters.category || subcategories.length === 0}
            options={subcategories.map((c) => ({ label: c.name, value: String(c.id) }))}
            value={filters.subcategory ? [filters.subcategory] : []}
            onChange={([value]) => update({ subcategory: value ?? '' })}
          />
          <CusSelect
            className="w-full sm:w-40"
            size="md"
            placeholder="Rang"
            clearable
            options={colors.map((c) => ({ label: c.name, value: String(c.id) }))}
            value={filters.color ? [filters.color] : []}
            onChange={([value]) => update({ color: value ?? '' })}
          />
          <CusSelect
            className="w-full sm:w-44"
            size="md"
            options={MODE_OPTIONS}
            value={[filters.mode || 'all']}
            onChange={([value]) => update({ mode: value === 'all' ? '' : (value ?? '') })}
          />
          <CusButton variant="outline" leftIcon={<SlidersHorizontal />} onClick={() => setDrawerOpen(true)}>
            Filtrlar{advancedCount > 0 && ` · ${advancedCount}`}
          </CusButton>
        </div>

        <ActiveFilterChips filters={filters} tree={tree} onRemove={removeFilters} onClear={clearFilters} />
      </CusCard>

      {isEmpty ? (
        <CusCard>
          {hasFilters ? (
            <CusEmptyState
              icon={<Search />}
              title="Hech narsa topilmadi"
              description="Filtrlarni o'zgartirib ko'ring"
              action={
                <CusButton variant="outline" onClick={clearFilters}>
                  Filtrlarni tozalash
                </CusButton>
              }
            />
          ) : (
            <CusEmptyState
              icon={<Package />}
              title="Hali mahsulot yo'q"
              description="Birinchi mahsulotingizni qo'shing — rasm, narx va kategoriya bilan"
              action={newButton}
            />
          )}
        </CusCard>
      ) : (
        <CusCard className={cn('p-0 transition-opacity sm:p-0', isFetching && !isLoading && 'opacity-60')}>
          <ProductTable products={products} tree={tree} isLoading={isLoading} onAction={handleAction} />
        </CusCard>
      )}

      {data && data.total > PAGE_SIZE && (
        <CusPagination
          className="self-end"
          total={data.total}
          pageSize={PAGE_SIZE}
          page={page}
          showSummary
          onChange={(next) => {
            update({ page: String(next) })
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}

      {drawerOpen && (
        <ProductFilterDrawer open onOpenChange={setDrawerOpen} filters={filters} onApply={(patch) => update(patch)} />
      )}

      {form && (
        <ProductFormModal
          open
          onOpenChange={(open) => !open && setForm(null)}
          product={form.product}
          source={form.source}
        />
      )}

      {pricing && (
        <ProductPriceModal product={pricing} open onOpenChange={(open) => !open && setPricing(null)} />
      )}

      <CusDialogDelete
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`"${toDelete?.name ?? ''}" o'chirilsinmi?`}
        description="Mahsulot saytdan ham olib tashlanadi. Bu amalni ortga qaytarib bo'lmaydi."
        onConfirm={handleDelete}
        isLoading={remove.isPending}
      />
    </div>
  )
}
