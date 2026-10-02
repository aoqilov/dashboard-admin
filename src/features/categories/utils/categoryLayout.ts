import { useStoredChoice } from '@/hooks/useStoredChoice'

/** Kategoriyalar ko'rinishi: jadval, ikki panel, kartalar to'ri, daraxt */
export type CategoryLayout = 'table' | 'split' | 'grid' | 'tree'

export const CATEGORY_LAYOUTS: CategoryLayout[] = ['table', 'split', 'grid', 'tree']

/** Tanlangan ko'rinish localStorage da saqlanadi */
export function useCategoryLayout() {
  return useStoredChoice<CategoryLayout>('categories-layout', CATEGORY_LAYOUTS, 'split')
}
