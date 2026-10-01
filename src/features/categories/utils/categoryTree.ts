import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import { mediaUrl } from '@/utils/media'

export interface CategoryTree {
  /** parent = null — asosiy kategoriyalar */
  roots: StoreCategory[]
  /** parent id -> subkategoriyalar */
  childrenOf: Map<number, StoreCategory[]>
  byId: Map<number, StoreCategory>
}

export function buildCategoryTree(categories: StoreCategory[]): CategoryTree {
  const byName = (a: StoreCategory, b: StoreCategory) => a.name.localeCompare(b.name)
  const roots: StoreCategory[] = []
  const childrenOf = new Map<number, StoreCategory[]>()
  const byId = new Map<number, StoreCategory>()

  for (const category of categories) {
    byId.set(category.id, category)
    if (category.parent == null) {
      roots.push(category)
    } else {
      const list = childrenOf.get(category.parent) ?? []
      list.push(category)
      childrenOf.set(category.parent, list)
    }
  }
  roots.sort(byName)
  childrenOf.forEach((list) => list.sort(byName))
  return { roots, childrenOf, byId }
}

/** Muqova: qayta ishlangan nusxa, bo'lmasa asli */
export function categoryCover(category: StoreCategory | undefined) {
  return mediaUrl(category?.cover_processed ?? category?.cover)
}
