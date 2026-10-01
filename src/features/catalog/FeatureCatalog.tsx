import { useState } from 'react'
import { Ellipsis, Pencil, Plus, Trash2 } from 'lucide-react'
import type { UseMutationResult } from '@tanstack/react-query'
import { getErrorMessage } from '@/api/api-config/apiError'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusTable, type TableColumn } from '@/components/ui/table/CusTable'
import { CusTabs } from '@/components/ui/tabs/CusTabs'
import { toaster } from '@/components/ui/toaster/toaster'
import { useSearchParams } from '@/router/router'
import { formatDate } from '@/utils/format'
import {
  useColorMutations,
  useColors,
  useMaterialCategories,
  useMaterialCategoryMutations,
  useMaterialMutations,
  useMaterials,
  useTagMutations,
  useTags,
} from './api-hooks/useCatalog'
import { CatalogItemDialog } from './components/CatalogItemDialog'
import { CATALOG_NOUN, type CatalogItem, type CatalogKind } from './utils/catalogKinds'

const TABS: { value: CatalogKind; label: string }[] = [
  { value: 'color', label: 'Ranglar' },
  { value: 'tag', label: 'Teglar' },
  { value: 'material', label: 'Materiallar' },
  { value: 'materialCategory', label: 'Material guruhlari' },
]

type Row = CatalogItem & { created_at: string }

/** Mahsulot ma'lumotnomalari: ranglar, teglar, materiallar */
export default function FeatureCatalog() {
  const [params, setParams] = useSearchParams()
  const tab = (TABS.find((item) => item.value === params.get('tab'))?.value ?? 'color') as CatalogKind

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Katalog" description="Mahsulot formasida tanlanadigan ma'lumotnomalar" />
      <CusCard className="flex flex-col gap-5">
        <CusTabs
          items={TABS.map(({ value, label }) => ({ value, label }))}
          value={tab}
          onChange={(value) => setParams({ tab: value })}
        />
        <CatalogTab key={tab} kind={tab} />
      </CusCard>
    </div>
  )
}

function CatalogTab({ kind }: { kind: CatalogKind }) {
  const queries = {
    color: useColors(),
    tag: useTags(),
    material: useMaterials(),
    materialCategory: useMaterialCategories(),
  }
  const removeMutations: Record<CatalogKind, UseMutationResult<void, Error, number>> = {
    color: useColorMutations().remove,
    tag: useTagMutations().remove,
    material: useMaterialMutations().remove,
    materialCategory: useMaterialCategoryMutations().remove,
  }
  const { data = [], isLoading } = queries[kind]
  const remove = removeMutations[kind]
  const groups = queries.materialCategory.data ?? []

  const [dialog, setDialog] = useState<{ item: CatalogItem | null } | null>(null)
  const [toDelete, setToDelete] = useState<Row | null>(null)
  const noun = CATALOG_NOUN[kind]

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

  const columns: TableColumn<Row>[] = [
    {
      key: 'name',
      header: 'Nomi',
      render: (row) => (
        <span className="flex items-center gap-3 text-sm font-medium text-heading">
          {kind === 'color' && (
            <span
              className="size-6 shrink-0 rounded-full border border-black/10 dark:border-white/15"
              style={{ backgroundColor: row.hex_code }}
            />
          )}
          {row.name}
        </span>
      ),
    },
    ...(kind === 'color'
      ? [{ key: 'hex', header: 'Kod', render: (row: Row) => <code className="text-xs text-muted">{row.hex_code}</code> }]
      : []),
    ...(kind === 'material'
      ? [
          {
            key: 'group',
            header: 'Guruh',
            render: (row: Row) => (
              <span className="text-sm text-content">{groups.find((g) => g.id === row.category)?.name ?? '—'}</span>
            ),
          },
        ]
      : []),
    {
      key: 'created_at',
      header: 'Qo\'shilgan',
      render: (row) => <span className="text-xs text-muted">{formatDate(row.created_at)}</span>,
    },
    {
      key: 'actions',
      header: '',
      align: 'end',
      width: '56px',
      render: (row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <CusMenu
            trigger={<CusIconButton icon={Ellipsis} label="Amallar" size="sm" />}
            items={[
              { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
              { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
            ]}
            onSelect={(value) => (value === 'edit' ? setDialog({ item: row }) : setToDelete(row))}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">{data.length} ta</p>
        <CusButton size="sm" leftIcon={<Plus />} onClick={() => setDialog({ item: null })}>
          {noun} qo'shish
        </CusButton>
      </div>

      <CusTable
        columns={columns}
        data={data as Row[]}
        rowKey={(row) => row.id}
        onRowClick={(row) => setDialog({ item: row })}
        isLoading={isLoading}
        emptyText={`Hali ${noun.toLowerCase()} qo'shilmagan`}
      />

      {dialog && (
        <CatalogItemDialog kind={kind} open item={dialog.item} onOpenChange={(open) => !open && setDialog(null)} />
      )}

      <CusDialogDelete
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`"${toDelete?.name}" o'chirilsinmi?`}
        description="Unga bog'langan mahsulotlardan ham olib tashlanadi."
        onConfirm={handleDelete}
        isLoading={remove.isPending}
      />
    </div>
  )
}
