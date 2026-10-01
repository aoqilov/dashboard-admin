import type { StoreProductMaterial } from '@/api/routes/stores-product-materials/storeProductMaterials.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { useMaterialCategories, useMaterialMutations, useMaterials } from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/modals/CatalogItemDialog'
import { formatDate } from '@/utils/format'
import { CrudSection } from './CrudSection'

/** Mahsulot materiallari (ipak, atlas ...) */
export function MaterialsTab() {
  const { data = [], isLoading } = useMaterials()
  const { data: groups = [] } = useMaterialCategories()
  const { remove } = useMaterialMutations()

  const columns: TableColumn<StoreProductMaterial>[] = [
    {
      key: 'name',
      header: 'Nomi',
      render: (row) => <span className="text-sm font-medium text-heading">{row.name}</span>,
    },
    {
      key: 'category',
      header: 'Guruh',
      render: (row) => (
        <span className="text-sm text-content">{groups.find((group) => group.id === row.category)?.name ?? '—'}</span>
      ),
    },
    {
      key: 'created_at',
      header: "Qo'shilgan",
      render: (row) => <span className="text-xs text-muted">{formatDate(row.created_at)}</span>,
    },
  ]

  return (
    <CrudSection
      noun="Material"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.name}
      remove={remove}
      deleteDescription="Unga bog'langan mahsulotlardan ham olib tashlanadi."
      renderModal={(props) => <CatalogItemDialog kind="material" {...props} />}
    />
  )
}
