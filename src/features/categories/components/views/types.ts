import type { ReactNode } from 'react'
import type { StoreCategory } from '@/api/routes/stores-categories/storeCategories.types'
import type { CategoryTree } from '../../utils/categoryTree'

/** Kategoriyalar ko'rinishlari (jadval, ikki panel, to'r, daraxt) uchun umumiy props */
export interface CategoryViewProps {
  tree: CategoryTree
  /** id -> mahsulotlar soni (yuklanguncha undefined) */
  productCounts?: Map<number, number | undefined>
  /** "Saytda" tugmasi va ⋯ menyusi */
  actions: (category: StoreCategory) => ReactNode
  /** Yangi kategoriya (parent = null) yoki subkategoriya qo'shish */
  onAdd: (parent: StoreCategory | null) => void
  /** Kategoriya yoki subkategoriya mahsulotlariga o'tish (filtr URL'da) */
  onOpenProducts: (category: StoreCategory) => void
}
