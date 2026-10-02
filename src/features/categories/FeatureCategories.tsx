import { useState } from 'react'
import {
  Columns2,
  Ellipsis,
  FolderPlus,
  LayoutGrid,
  Layers,
  ListTree,
  Pencil,
  Plus,
  Table2,
  Trash2,
} from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { LayoutSwitch, type LayoutOption } from '@/components/shared/layout-switch/LayoutSwitch'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { toaster } from '@/components/ui/toaster/toaster'
import { VisibleSwitch } from '@/features/store/components/VisibleSwitch'
import { navigate } from '@/utils/navigate'
import { useCategories, useCategoryMutations } from './api-hooks/useCategories'
import { CategoryGridView } from './components/views/CategoryGridView'
import { CategorySplitView } from './components/views/CategorySplitView'
import { CategoryTableView } from './components/views/CategoryTableView'
import { CategoryTreeView } from './components/views/CategoryTreeView'
import { CategoryDialog } from './modals/CategoryDialog'
import { useCategoryLayout, type CategoryLayout } from './utils/categoryLayout'

type DialogState =
  | { mode: 'create'; parent: StoreCategory | null }
  | { mode: 'edit'; category: StoreCategory }
  | null

const LAYOUTS: LayoutOption<CategoryLayout>[] = [
  { value: 'table', label: 'Jadval', icon: Table2 },
  { value: 'split', label: 'Ikki panel', icon: Columns2 },
  { value: 'grid', label: "Kartalar to'ri", icon: LayoutGrid },
  { value: 'tree', label: 'Daraxt', icon: ListTree },
]

/**
 * Kategoriyalar: 4 xil ko'rinish (jadval, ikki panel, kartalar to'ri, daraxt), tanlov eslab qolinadi.
 * Subkategoriya — parent'i bor oddiy kategoriya. Amallar va dialoglar hamma ko'rinish uchun umumiy.
 */
export default function FeatureCategories() {
  const { data: tree, isLoading } = useCategories()
  const { update, remove } = useCategoryMutations()
  const [layout, setLayout] = useCategoryLayout()
  const [dialog, setDialog] = useState<DialogState>(null)
  const [toDelete, setToDelete] = useState<StoreCategory | null>(null)

  const roots = tree?.roots ?? []
  const deleteChildren = toDelete ? (tree?.childrenOf.get(toDelete.id)?.length ?? 0) : 0

  /** /products sahifasi shu kategoriya yoki subkategoriya bo'yicha filtrlangan holda ochiladi */
  const openProducts = (category: StoreCategory) => {
    const query = new URLSearchParams(
      category.parent != null
        ? { category: String(category.parent), subcategory: String(category.id) }
        : { category: String(category.id) },
    )
    navigate(`/products?${query}`)
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

  /** "Saytda" tugmasi va ⋯ menyusi; asosiy kategoriyada subkategoriya qo'shish ham bor */
  const actions = (category: StoreCategory) => (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs text-muted sm:block">Saytda</span>
      <VisibleSwitch id={category.id} visible={category.visible} update={update} />
      <CusMenu
        trigger={<CusIconButton icon={Ellipsis} label="Amallar" variant="ghost" size="sm" />}
        items={[
          { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
          ...(category.parent == null
            ? [{ value: 'add-sub', label: "Subkategoriya qo'shish", icon: <FolderPlus className="size-4" /> }]
            : []),
          { separator: true as const },
          { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
        ]}
        onSelect={(value) => {
          if (value === 'edit') setDialog({ mode: 'edit', category })
          else if (value === 'add-sub') setDialog({ mode: 'create', parent: category })
          else setToDelete(category)
        }}
      />
    </div>
  )

  const viewProps = {
    tree: tree!,
    actions,
    onAdd: (parent: StoreCategory | null) => setDialog({ mode: 'create', parent }),
    onOpenProducts: openProducts,
  }

  const addButton = (
    <CusButton leftIcon={<Plus />} onClick={() => setDialog({ mode: 'create', parent: null })}>
      Kategoriya qo'shish
    </CusButton>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategoriyalar"
        description="Mahsulotlar kategoriya va subkategoriyalarga bo'linadi"
        actions={
          <>
            <LayoutSwitch options={LAYOUTS} value={layout} onChange={setLayout} />
            {addButton}
          </>
        }
      />

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <CusSkeleton height="420px" />
          <CusSkeleton height="420px" />
        </div>
      ) : roots.length === 0 ? (
        <CusCard>
          <CusEmptyState
            icon={<Layers />}
            title="Hali kategoriya yo'q"
            description="Mahsulot qo'shishdan oldin kamida bitta kategoriya yarating"
            action={addButton}
          />
        </CusCard>
      ) : (
        <>
          {layout === 'table' && (
            <CusCard className="p-0 sm:p-0">
              <CategoryTableView {...viewProps} />
            </CusCard>
          )}
          {layout === 'split' && <CategorySplitView {...viewProps} />}
          {layout === 'grid' && <CategoryGridView {...viewProps} />}
          {layout === 'tree' && <CategoryTreeView {...viewProps} />}
        </>
      )}

      {dialog && (
        <CategoryDialog
          open
          onOpenChange={(open) => !open && setDialog(null)}
          category={dialog.mode === 'edit' ? dialog.category : null}
          parent={dialog.mode === 'create' ? dialog.parent : null}
        />
      )}

      <CusDialogDelete
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`"${toDelete?.name}" o'chirilsinmi?`}
        description={
          deleteChildren > 0
            ? `Bu kategoriya ichida ${deleteChildren} ta subkategoriya bor. Ular va ularga bog'langan mahsulotlar ta'sirlanishi mumkin.`
            : "Bu amalni ortga qaytarib bo'lmaydi."
        }
        onConfirm={handleDelete}
        isLoading={remove.isPending}
      />
    </div>
  )
}
