import { useQuery } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeDiscounts } from '@/api/routes/stores-discounts/storeDiscounts.api'
import { useCrudMutations } from '@/hooks/useCrudMutations'
import { activeRuleMap } from '../utils/discountPrice'

export const discountKeys = { all: ['discounts'] as const }

const ALL_KEY = [...discountKeys.all, 'all']

/** Barcha chegirmalar. Holat muddatdan hisoblanadi, shuning uchun filtr/tartib brauzerda */
export function useDiscountList() {
  return useQuery({ queryKey: ALL_KEY, queryFn: () => fetchAll(storeDiscounts.getAll) })
}

/** Hozir faol chegirmalar: mahsulot id -> qoidalar (mahsulotlar jadvalida eski/yangi narx uchun) */
export function useDiscountRules() {
  return useQuery({ queryKey: ALL_KEY, queryFn: () => fetchAll(storeDiscounts.getAll), select: activeRuleMap })
}

export const useDiscountMutations = () => useCrudMutations(discountKeys.all, storeDiscounts)
