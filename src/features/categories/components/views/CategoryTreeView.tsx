import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { cn } from '@/utils/cn'
import { CategoryThumb } from '../CategoryThumb'
import type { CategoryViewProps } from './types'

/** Daraxt: har bir asosiy kategoriya ochiladigan qator, ichida subkategoriyalari (bir nechtasi birdan ochiq bo'lishi mumkin) */
export function CategoryTreeView({ tree, actions, onAdd, onOpenProducts }: CategoryViewProps) {
  const [openIds, setOpenIds] = useState<Set<number>>(() => new Set(tree.roots.slice(0, 1).map((root) => root.id)))

  const toggle = (id: number) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <CusCard className="p-2 sm:p-2">
      <ul className="flex flex-col divide-y divide-border">
        {tree.roots.map((root) => {
          const children = tree.childrenOf.get(root.id) ?? []
          const open = openIds.has(root.id)
          return (
            <li key={root.id} className="py-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggle(root.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-control px-3 py-2 text-left transition-colors hover:bg-hover"
                >
                  <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform', !open && '-rotate-90')} />
                  <CategoryThumb category={root} className="size-11" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-heading">{root.name}</span>
                    <span className="text-xs text-muted">{children.length} ta subkategoriya</span>
                  </span>
                  {root.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
                </button>
                {actions(root)}
              </div>

              {/* Ochilib-yopilish: grid-rows transition */}
              <div className={cn('grid transition-[grid-template-rows] duration-200', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <ul className="ml-9 flex flex-col border-l border-border py-1 pl-3">
                    {children.map((child) => (
                      <li key={child.id} className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenProducts(child)}
                          className="group flex min-w-0 flex-1 items-center gap-3 rounded-control px-2 py-1.5 text-left transition-colors hover:bg-hover"
                        >
                          <CategoryThumb category={child} className="size-8" />
                          <span className="min-w-0 flex-1 truncate text-sm text-content group-hover:text-heading">
                            {child.name}
                          </span>
                          {child.visible === false && <CusBadge color="dark">Yashirin</CusBadge>}
                        </button>
                        {actions(child)}
                      </li>
                    ))}
                    <li className="px-2 py-1.5">
                      <CusButton size="sm" variant="ghost" leftIcon={<Plus />} onClick={() => onAdd(root)}>
                        Subkategoriya qo'shish
                      </CusButton>
                    </li>
                  </ul>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </CusCard>
  )
}
