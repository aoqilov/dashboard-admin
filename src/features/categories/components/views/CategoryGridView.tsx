import { ImageOff, Plus } from 'lucide-react'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { categoryCover } from '../../utils/categoryTree'
import { CategoryThumb } from '../CategoryThumb'
import type { CategoryViewProps } from './types'

/** Katta muqova (4:3); rasm yo'q bo'lsa joy belgisi */
function Cover({ category }: { category: StoreCategory }) {
  const src = categoryCover(category)
  return (
    <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-hover text-subtle">
      {src ? <img src={src} alt="" loading="lazy" className="size-full object-cover" /> : <ImageOff className="size-8" />}
    </div>
  )
}

/** Kartalar to'ri: katta muqova, ostida nom, subkategoriyalar chiplari va amallar */
export function CategoryGridView({ tree, actions, onAdd, onOpenProducts }: CategoryViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {tree.roots.map((root) => {
        const children = tree.childrenOf.get(root.id) ?? []
        return (
          <div key={root.id} className="flex flex-col overflow-hidden rounded-card bg-surface shadow-card">
            <button type="button" onClick={() => onOpenProducts(root)} className="text-left">
              <Cover category={root} />
            </button>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <button type="button" onClick={() => onOpenProducts(root)} className="min-w-0 text-left">
                  <p className="truncate text-base font-semibold text-heading">{root.name}</p>
                  <p className="text-xs text-muted">{children.length} ta subkategoriya</p>
                </button>
                {root.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => onOpenProducts(child)}
                    className="flex items-center gap-1.5 rounded-full border border-border py-0.5 pr-2.5 pl-0.5 text-xs text-content transition-colors hover:bg-hover hover:text-heading"
                  >
                    <CategoryThumb category={child} className="size-5 rounded-full" />
                    {child.name}
                    {child.visible === false && <span className="text-subtle">· yashirin</span>}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => onAdd(root)}
                  className="flex items-center gap-1 rounded-full border border-dashed border-border-strong px-2.5 py-1 text-xs text-primary transition-colors hover:bg-hover dark:text-primary-light"
                >
                  <Plus className="size-3" /> Subkategoriya
                </button>
              </div>

              <div className="mt-auto flex justify-end border-t border-border pt-3">{actions(root)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
