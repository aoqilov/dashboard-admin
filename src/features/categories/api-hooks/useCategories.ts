import { useQuery } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeCategories } from '@/api/routes/stores-categories/storeCategories.api'
import { useCrudMutations } from '@/hooks/useCrudMutations'
import { buildCategoryTree } from '../utils/categoryTree'

export const categoryKeys = { all: ['categories'] } as const

/** Barcha kategoriyalar (daraxt ko'rinishida ham) */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => fetchAll(storeCategories.getAll),
    select: buildCategoryTree,
  })
}

export const useCategoryMutations = () => useCrudMutations(categoryKeys.all, storeCategories)
