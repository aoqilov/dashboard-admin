import { useQuery } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeColors } from '@/api/routes/stores-colors/storeColors.api'
import { storeProductMaterialCategories } from '@/api/routes/stores-product-material-categories/storeProductMaterialCategories.api'
import { storeProductMaterials } from '@/api/routes/stores-product-materials/storeProductMaterials.api'
import { storeTags } from '@/api/routes/stores-tags/storeTags.api'
import { useCrudMutations } from '@/hooks/useCrudMutations'

/**
 * Mahsulot ma'lumotnomalari: ranglar, teglar, materiallar, material guruhlari.
 * Kam o'zgaradi — 5 daqiqa kesh.
 */
const STALE = 5 * 60_000

export const catalogKeys = {
  colors: ['colors'],
  tags: ['tags'],
  materials: ['materials'],
  materialCategories: ['material-categories'],
} as const

export function useColors() {
  return useQuery({ queryKey: catalogKeys.colors, queryFn: () => fetchAll(storeColors.getAll), staleTime: STALE })
}

export function useTags() {
  return useQuery({ queryKey: catalogKeys.tags, queryFn: () => fetchAll(storeTags.getAll), staleTime: STALE })
}

export function useMaterials() {
  return useQuery({
    queryKey: catalogKeys.materials,
    queryFn: () => fetchAll(storeProductMaterials.getAll),
    staleTime: STALE,
  })
}

export function useMaterialCategories() {
  return useQuery({
    queryKey: catalogKeys.materialCategories,
    queryFn: () => fetchAll(storeProductMaterialCategories.getAll),
    staleTime: STALE,
  })
}

export const useColorMutations = () => useCrudMutations(catalogKeys.colors, storeColors)
export const useTagMutations = () => useCrudMutations(catalogKeys.tags, storeTags)
export const useMaterialMutations = () => useCrudMutations(catalogKeys.materials, storeProductMaterials)
export const useMaterialCategoryMutations = () =>
  useCrudMutations(catalogKeys.materialCategories, storeProductMaterialCategories)
