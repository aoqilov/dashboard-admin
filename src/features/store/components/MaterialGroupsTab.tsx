import type { StoreProductMaterialCategory } from '@/api/routes/stores-product-material-categories/storeProductMaterialCategories.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import {
  useMaterialCategories,
  useMaterialCategoryMutations,
  useMaterials,
} from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/modals/CatalogItemDialog'
import { formatDate } from '@/utils/format'
import { CrudSection } from './CrudSection'

/** Material guruhlari (mato, bezak ...) */
export function MaterialGroupsTab() {
  const { data = [], isLoading } = useMaterialCategories()
  const { data: materials = [] } = useMaterials()
  const { remove } = useMaterialCategoryMutations()

  const countByGroup = new Map<number, number>()
  for (const material of materials) {
    if (material.category) countByGroup.set(material.category, (countByGroup.get(material.category) ?? 0) + 1)
  }

  const columns: TableColumn<StoreProductMaterialCategory>[] = [
    {
      key: 'name',
      header: 'Nomi',
      render: (row) => <span className="text-sm font-medium text-heading">{row.name}</span>,
    },
    {
      key: 'materials',
      header: 'Materiallar',
      render: (row) => <span className="text-sm text-content">{countByGroup.get(row.id) ?? 0} ta</span>,
    },
    {
      key: 'created_at',
      header: "Qo'shilgan",
      render: (row) => <span className="text-xs text-muted">{formatDate(row.created_at)}</span>,
    },
  ]

  return (
    <CrudSection
      noun="Material guruhi"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.name}
      remove={remove}
      renderModal={(props) => <CatalogItemDialog kind="materialCategory" {...props} />}
    />
  )
}
