import type { StoreTag } from '@/api/routes/stores-tags/storeTags.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { useTagMutations, useTags } from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/modals/CatalogItemDialog'
import { formatDate } from '@/utils/format'
import { CrudSection } from './CrudSection'

const columns: TableColumn<StoreTag>[] = [
  {
    key: 'name',
    header: 'Nomi',
    render: (row) => <span className="text-sm font-medium text-heading">{row.name}</span>,
  },
  {
    key: 'created_at',
    header: "Qo'shilgan",
    render: (row) => <span className="text-xs text-muted">{formatDate(row.created_at)}</span>,
  },
]

/** Mahsulot teglari */
export function TagsTab() {
  const { data = [], isLoading } = useTags()
  const { remove } = useTagMutations()

  return (
    <CrudSection
      noun="Teg"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.name}
      remove={remove}
      deleteDescription="Unga bog'langan mahsulotlardan ham olib tashlanadi."
      renderModal={(props) => <CatalogItemDialog kind="tag" {...props} />}
    />
  )
}
