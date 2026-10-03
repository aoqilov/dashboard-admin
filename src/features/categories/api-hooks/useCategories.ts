import { useQueries, useQuery } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeProducts } from '@/api/routes/stores-products/storeProducts.api'
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

/** Har bir kategoriya/subkategoriya bo'yicha mahsulotlar soni (id -> soni) */
export function useCategoryProductCounts(ids: number[], parentOf: Map<number, number | null | undefined>) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: [...categoryKeys.all, 'product-count', id],
      queryFn: async () => {
        const filters = parentOf.get(id) != null ? { subcategory: id } : { category: id }
        return (await storeProducts.getAll({ page: 1, pageSize: 1, filters })).total
      },
    })),
    combine: (results) => new Map(ids.map((id, i) => [id, results[i]?.data] as const)),
  })
}

export const useCategoryMutations = () => useCrudMutations(categoryKeys.all, storeCategories)
