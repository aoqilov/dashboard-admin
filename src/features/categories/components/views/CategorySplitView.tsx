import { useState } from 'react'
import { ArrowRight, ChevronRight, FolderTree, Layers, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'
import { CusTitle } from '@/components/ui/typography/CusTypography'
import { cn } from '@/utils/cn'
import { CategoryThumb } from '../CategoryThumb'
import type { CategoryViewProps } from './types'

/** Ikki panel: chapda asosiy kategoriyalar, o'ngda tanlanganning subkategoriyalari */
export function CategorySplitView({ tree, productCounts, actions, onAdd, onOpenProducts }: CategoryViewProps) {
  const countText = (id: number) => {
    const n = productCounts?.get(id)
    return n == null ? '' : `${n} ta mahsulot`
  }

  /** null — "Hammasi": barcha subkategoriyalar */
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = tree.roots.find((root) => root.id === selectedId)
  const allChildren = tree.roots.flatMap((root) => tree.childrenOf.get(root.id) ?? [])
  const children = selected ? (tree.childrenOf.get(selected.id) ?? []) : allChildren

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
      {/* Asosiy kategoriyalar */}
      <CusCard className="p-2 sm:p-2">
        <ul className="flex flex-col">
          <li>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className={cn(
                'flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left transition-colors',
                !selected ? 'bg-primary/8 dark:bg-primary/15' : 'hover:bg-hover',
              )}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-hover text-muted">
                <Layers className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block truncate text-sm font-medium',
                    !selected ? 'text-primary dark:text-primary-light' : 'text-heading',
                  )}
                >
                  Hammasi
                </span>
                <span className="text-xs text-muted">
                  {tree.roots.length} ta kategoriya · {allChildren.length} ta subkategoriya
                </span>
              </span>
              <ChevronRight className={cn('size-4 shrink-0', !selected ? 'text-primary' : 'text-subtle')} />
            </button>
          </li>
          {tree.roots.map((root) => {
            const count = tree.childrenOf.get(root.id)?.length ?? 0
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
                    <span
                      className={cn(
                        'block truncate text-sm font-medium',
                        active ? 'text-primary dark:text-primary-light' : 'text-heading',
                      )}
                    >
                      {root.name}
                    </span>
                    <span className="text-xs text-muted">
                      {count} ta subkategoriya{countText(root.id) && ` · ${countText(root.id)}`}
                    </span>
                  </span>
                  {root.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
                  <ChevronRight className={cn('size-4 shrink-0', active ? 'text-primary' : 'text-subtle')} />
                </button>
              </li>
            )
          })}
        </ul>
      </CusCard>

      {/* Tanlangan kategoriya va uning subkategoriyalari */}
      <CusCard className="flex flex-col gap-5">
        {selected && (
          <>
            <div className="flex items-center gap-4">
              <CategoryThumb category={selected} className="size-16" />
              <div className="min-w-0 flex-1">
                <CusTitle size="lg" className="truncate">
                  {selected.name}
                </CusTitle>
                <p className="flex items-center gap-2 text-sm text-muted">
                  Asosiy kategoriya
                  {selected.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
                </p>
              </div>
              {actions(selected)}
            </div>

            <div className="h-px bg-border" />
          </>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-heading">
            {selected ? 'Subkategoriyalar' : 'Barcha subkategoriyalar'} ({children.length})
          </p>
          {selected && (
            <CusButton size="sm" variant="outline" leftIcon={<Plus />} onClick={() => onAdd(selected)}>
              Subkategoriya
            </CusButton>
          )}
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
            {/* Tanlangan kategoriyaning barcha subkategoriyalari mahsulotlari */}
            {selected && (
              <li className="flex items-center gap-1 py-1">
                <button
                  type="button"
                  onClick={() => onOpenProducts(selected)}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-control px-2 py-1.5 text-left transition-colors hover:bg-hover"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-hover text-muted">
                    <Layers className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-heading group-hover:text-primary dark:group-hover:text-primary-light">
                    Hammasi
                  </span>
                  <span className="shrink-0 text-xs text-muted">{countText(selected.id)}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    Mahsulotlar <ArrowRight className="size-3.5" />
                  </span>
                </button>
              </li>
            )}
            {children.map((child) => (
              <li key={child.id} className="flex items-center gap-1 py-1">
                {/* Bosilganda — shu subkategoriya mahsulotlari (filtr URL'da) */}
                <button
                  type="button"
                  onClick={() => onOpenProducts(child)}
                  className="group flex min-w-0 flex-1 items-center gap-3 rounded-control px-2 py-1.5 text-left transition-colors hover:bg-hover"
                >
                  <CategoryThumb category={child} className="size-9" />
                  <span className="min-w-0 flex-1 truncate text-sm text-heading group-hover:text-primary dark:group-hover:text-primary-light">
                    {child.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted">{countText(child.id)}</span>
                  {!selected && child.parent != null && (
                    <span className="shrink-0 text-xs text-muted">{tree.byId.get(child.parent)?.name}</span>
                  )}
                  {child.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
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
    </div>
  )
}
