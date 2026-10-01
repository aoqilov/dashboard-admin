import { useEffect, useRef, useState } from 'react'
import { LayoutGrid, List, Package, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusTag } from '@/components/ui/badge/CusTag'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSegment } from '@/components/ui/segment/CusSegment'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { CusPagination } from '@/components/ui/table/CusPagination'
import { toaster } from '@/components/ui/toaster/toaster'
import { useColors } from '@/features/catalog/api-hooks/useCatalog'
import { useCategories } from '@/features/categories/api-hooks/useCategories'
import { navigate } from '@/utils/navigate'
import { useProductMutations, useProducts } from './api-hooks/useProducts'
import { ProductFilterDrawer } from './components/list/ProductFilterDrawer'
import { ProductGrid } from './components/list/ProductGrid'
import { ProductTable } from './components/list/ProductTable'
import { ADVANCED_KEYS, PAGE_SIZE, useProductFilters, type FilterKey } from './utils/useProductFilters'

type View = 'table' | 'grid'
const VIEW_KEY = 'products:view'

function getInitialView(): View {
  try {
    return localStorage.getItem(VIEW_KEY) === 'grid' ? 'grid' : 'table'
  } catch {
    return 'table'
  }
}

const MODE_OPTIONS = [
  { label: 'Barcha xizmatlar', value: 'all' },
  { label: 'Sotuvda', value: 'sale' },
  { label: 'Ijarada', value: 'rent' },
]

export default function FeatureProducts() {
  const { filters, page, body, update, clear, activeCount } = useProductFilters()
  const { data, isLoading, isFetching } = useProducts(body)
  const { data: tree } = useCategories()
  const { data: colors = [] } = useColors()
  const { remove } = useProductMutations()

  const [view, setView] = useState<View>(getInitialView)
  const [search, setSearch] = useState(filters.q)
  const [drawerOpen, setDrawerOpen] = useState(false)
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

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_KEY, view)
    } catch {
      // saqlab bo'lmasa ham ishlayveradi
    }
  }, [view])

  const products = data?.items ?? []
  const roots = tree?.roots ?? []
  const subcategories = filters.category ? (tree?.childrenOf.get(Number(filters.category)) ?? []) : []
  const advancedCount = ADVANCED_KEYS.filter((key) => filters[key]).length
  const hasFilters = activeCount > 0

  const openProduct = (product: StoreProduct) => navigate(`/products/${product.id}`)

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

  // Faol filtr belgilari (× bilan olib tashlanadi)
  const chips: { key: FilterKey[]; label: string }[] = []
  if (filters.q) chips.push({ key: ['q'], label: `"${filters.q}"` })
  if (filters.category) {
    const name = tree?.byId.get(Number(filters.category))?.name ?? '…'
    chips.push({ key: ['category', 'subcategory'], label: name })
  }
  if (filters.subcategory) {
    chips.push({ key: ['subcategory'], label: tree?.byId.get(Number(filters.subcategory))?.name ?? '…' })
  }
  if (filters.color) {
    chips.push({ key: ['color'], label: colors.find((c) => String(c.id) === filters.color)?.name ?? 'Rang' })
  }
  if (filters.mode) chips.push({ key: ['mode'], label: filters.mode === 'sale' ? 'Sotuvda' : 'Ijarada' })
  if (filters.price_min || filters.price_max) {
    chips.push({ key: ['price_min', 'price_max'], label: `Narx ${filters.price_min || '0'}–${filters.price_max || '∞'}` })
  }
  if (filters.size_min || filters.size_max) {
    chips.push({ key: ['size_min', 'size_max'], label: `O'lcham ${filters.size_min || '…'}–${filters.size_max || '…'}` })
  }

  const removeChip = (keys: FilterKey[]) => {
    if (keys.includes('q')) resetSearch()
    update(Object.fromEntries(keys.map((key) => [key, ''])))
  }

  const newButton = (
    <CusButton leftIcon={<Plus />} onClick={() => navigate('/products/new')}>
      Mahsulot qo'shish
    </CusButton>
  )

  const isEmpty = !isLoading && products.length === 0

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mahsulotlar"
        description={data ? `Jami ${data.total} ta mahsulot` : 'Do\'kondagi barcha mahsulotlar'}
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
          <CusSegment
            size="sm"
            value={view}
            onChange={(value) => setView(value as View)}
            items={[
              { value: 'table', label: <List className="size-4" aria-label="Jadval" /> },
              { value: 'grid', label: <LayoutGrid className="size-4" aria-label="Kartalar" /> },
            ]}
          />
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <CusTag key={chip.key.join()} size="sm" onClose={() => removeChip(chip.key)}>
                {chip.label}
              </CusTag>
            ))}
            <button
              type="button"
              onClick={() => {
                resetSearch()
                clear()
              }}
              className="ml-1 text-xs font-medium text-primary hover:underline"
            >
              Hammasini tozalash
            </button>
          </div>
        )}
      </CusCard>

      {isEmpty ? (
        <CusCard>
          {hasFilters ? (
            <CusEmptyState
              icon={<Search />}
              title="Hech narsa topilmadi"
              description="Filtrlarni o'zgartirib ko'ring"
              action={
                <CusButton
                  variant="outline"
                  onClick={() => {
                    resetSearch()
                    clear()
                  }}
                >
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
        <div className={isFetching && !isLoading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          {view === 'table' ? (
            <CusCard className="p-0 sm:p-0">
              <ProductTable
                products={products}
                tree={tree}
                isLoading={isLoading}
                onOpen={openProduct}
                onDelete={setToDelete}
              />
            </CusCard>
          ) : (
            <ProductGrid products={products} tree={tree} isLoading={isLoading} onOpen={openProduct} />
          )}
        </div>
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
        <ProductFilterDrawer
          open
          onOpenChange={setDrawerOpen}
          filters={filters}
          onApply={(patch) => update(patch)}
        />
      )}

      <CusDialogDelete
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`"${toDelete?.name}" o'chirilsinmi?`}
        description="Mahsulot saytdan ham olib tashlanadi. Bu amalni ortga qaytarib bo'lmaydi."
        onConfirm={handleDelete}
        isLoading={remove.isPending}
      />
    </div>
  )
}
