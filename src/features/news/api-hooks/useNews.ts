import { useQuery } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeNews } from '@/api/routes/stores-news/storeNews.api'
import { useCrudMutations } from '@/hooks/useCrudMutations'

export const newsKeys = { all: ['news'] as const }

/** Barcha yangiliklar. Holat muddatdan hisoblanadi, shuning uchun filtr/tartib brauzerda */
export function useNewsList() {
  return useQuery({ queryKey: [...newsKeys.all, 'all'], queryFn: () => fetchAll(storeNews.getAll) })
}

export const useNewsMutations = () => useCrudMutations(newsKeys.all, storeNews)
