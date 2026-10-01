import { useState } from 'react'
import { ArrowRight, ChevronRight, Ellipsis, FolderTree, Layers, Pencil, Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/api/api-config/apiError'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusDialogDelete } from '@/components/ui/dialog/CusDialogDelete'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusMenu } from '@/components/ui/menu/CusMenu'
import { CusSkeleton } from '@/components/ui/skeleton/CusSkeleton'
import { toaster } from '@/components/ui/toaster/toaster'
import { CusTitle } from '@/components/ui/typography/CusTypography'
import { cn } from '@/utils/cn'
import { navigate } from '@/utils/navigate'
import { useCategories, useCategoryMutations } from './api-hooks/useCategories'
import { CategoryDialog } from './modals/CategoryDialog'
import { CategoryThumb } from './components/CategoryThumb'

type DialogState =
  | { mode: 'create'; parent: StoreCategory | null }
  | { mode: 'edit'; category: StoreCategory }
  | null

/**
 * Kategoriyalar: chapda asosiy kategoriyalar, o'ngda tanlanganning subkategoriyalari.
 * Subkategoriya — parent'i bor oddiy kategoriya.
 */
export default function FeatureCategories() {
  const { data: tree, isLoading } = useCategories()
  const { remove } = useCategoryMutations()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [dialog, setDialog] = useState<DialogState>(null)
  const [toDelete, setToDelete] = useState<StoreCategory | null>(null)

  const roots = tree?.roots ?? []
  const selected = roots.find((root) => root.id === selectedId) ?? roots[0]
  const children = selected ? (tree?.childrenOf.get(selected.id) ?? []) : []
  const deleteChildren = toDelete ? (tree?.childrenOf.get(toDelete.id)?.length ?? 0) : 0

  /** /products sahifasi shu subkategoriya bo'yicha filtrlangan holda ochiladi */
  const openProducts = (sub: StoreCategory) => {
    const query = new URLSearchParams({ category: String(sub.parent ?? ''), subcategory: String(sub.id) })
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

  const actions = (category: StoreCategory) => (
    <CusMenu
      trigger={<CusIconButton icon={Ellipsis} label="Amallar" variant="ghost" size="sm" />}
      items={[
        { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
        { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
      ]}
      onSelect={(value) => (value === 'edit' ? setDialog({ mode: 'edit', category }) : setToDelete(category))}
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategoriyalar"
        description="Mahsulotlar kategoriya va subkategoriyalarga bo'linadi"
        actions={
          <CusButton leftIcon={<Plus />} onClick={() => setDialog({ mode: 'create', parent: null })}>
            Kategoriya qo'shish
          </CusButton>
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
            action={
              <CusButton leftIcon={<Plus />} onClick={() => setDialog({ mode: 'create', parent: null })}>
                Kategoriya qo'shish
              </CusButton>
            }
          />
        </CusCard>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          {/* Asosiy kategoriyalar */}
          <CusCard className="p-2 sm:p-2">
            <ul className="flex flex-col">
              {roots.map((root) => {
                const count = tree?.childrenOf.get(root.id)?.length ?? 0
                const active = root.id === selected?.id
                return (
                  <li key={root.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(root.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left transition-colors',
                        active ? 'bg-primary/8 dark:bg-primary/15' : 'hover:bg-hover',
                      )}
                    >
                      <CategoryThumb category={root} />
                      <span className="min-w-0 flex-1">
                        <span className={cn('block truncate text-sm font-medium', active ? 'text-primary dark:text-primary-light' : 'text-heading')}>
                          {root.name}
                        </span>
                        <span className="text-xs text-muted">{count} ta subkategoriya</span>
                      </span>
                      <ChevronRight className={cn('size-4 shrink-0', active ? 'text-primary' : 'text-subtle')} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </CusCard>

          {/* Tanlangan kategoriya va uning subkategoriyalari */}
          {selected && (
            <CusCard className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <CategoryThumb category={selected} className="size-16" />
                <div className="min-w-0 flex-1">
                  <CusTitle size="lg" className="truncate">
                    {selected.name}
                  </CusTitle>
                  <p className="text-sm text-muted">Asosiy kategoriya</p>
                </div>
                {actions(selected)}
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-heading">Subkategoriyalar</p>
                <CusButton
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus />}
                  onClick={() => setDialog({ mode: 'create', parent: selected })}
                >
                  Subkategoriya
                </CusButton>
              </div>

              {children.length === 0 ? (
                <CusEmptyState
                  size="sm"
                  icon={<FolderTree />}
                  title="Subkategoriya yo'q"
                  description="Masalan: Ko'ylaklar → Kechki, To'y, Kundalik"
                />
              ) : (
                <ul className="flex flex-col divide-y divide-border">
                  {children.map((child) => (
                    <li key={child.id} className="flex items-center gap-1 py-1">
                      {/* Bosilganda — shu subkategoriya mahsulotlari (filtr URL'da) */}
                      <button
                        type="button"
                        onClick={() => openProducts(child)}
                        className="group flex min-w-0 flex-1 items-center gap-3 rounded-control px-2 py-1.5 text-left transition-colors hover:bg-hover"
                      >
                        <CategoryThumb category={child} className="size-9" />
                        <span className="min-w-0 flex-1 truncate text-sm text-heading group-hover:text-primary dark:group-hover:text-primary-light">
                          {child.name}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                          Mahsulotlar <ArrowRight className="size-3.5" />
                        </span>
                      </button>
                      {actions(child)}
                    </li>
                  ))}
                </ul>
              )}
            </CusCard>
          )}
        </div>
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
