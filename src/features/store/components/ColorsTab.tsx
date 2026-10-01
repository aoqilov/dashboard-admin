import type { StoreColor } from '@/api/routes/stores-colors/storeColors.types'
import type { TableColumn } from '@/components/ui/table/CusTable'
import { useColorMutations, useColors } from '@/features/catalog/api-hooks/useCatalog'
import { CatalogItemDialog } from '@/features/catalog/modals/CatalogItemDialog'
import { formatDate } from '@/utils/format'
import { CrudSection } from './CrudSection'

const columns: TableColumn<StoreColor>[] = [
  {
    key: 'name',
    header: 'Nomi',
    render: (row) => (
      <span className="flex items-center gap-3 text-sm font-medium text-heading">
        <span
          className="size-6 shrink-0 rounded-full border border-black/10 dark:border-white/15"
          style={{ backgroundColor: row.hex_code }}
        />
        {row.name}
      </span>
    ),
  },
  {
    key: 'hex_code',
    header: 'Kod',
    render: (row) => <code className="text-xs text-muted">{row.hex_code}</code>,
  },
  {
    key: 'created_at',
    header: "Qo'shilgan",
    render: (row) => <span className="text-xs text-muted">{formatDate(row.created_at)}</span>,
  },
]

/** Mahsulot ranglari */
export function ColorsTab() {
  const { data = [], isLoading } = useColors()
  const { remove } = useColorMutations()

  return (
    <CrudSection
      noun="Rang"
      columns={columns}
      data={data}
      isLoading={isLoading}
      getName={(row) => row.name}
      remove={remove}
      deleteDescription="Unga bog'langan mahsulotlardan ham olib tashlanadi."
      renderModal={(props) => <CatalogItemDialog kind="color" {...props} />}
    />
  )
}
