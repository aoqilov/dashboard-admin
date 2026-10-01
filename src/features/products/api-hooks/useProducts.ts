import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { GetAllRequest } from '@/api/common.types'
import { storeProducts } from '@/api/routes/stores-products/storeProducts.api'
import type { StoreProductUpdateRequest } from '@/api/routes/stores-products/storeProducts.types'

export const productKeys = {
  all: ['products'] as const,
  list: (body: GetAllRequest) => ['products', 'list', body] as const,
  detail: (id: number) => ['products', 'detail', id] as const,
}

/** Ro'yxat. Sahifa/filtr almashganda eski ma'lumot ko'rinib turadi (sakrash yo'q) */
export function useProducts(body: GetAllRequest) {
  return useQuery({
    queryKey: productKeys.list(body),
    queryFn: () => storeProducts.getAll(body),
    placeholderData: keepPreviousData,
  })
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id!),
    queryFn: () => storeProducts.getOne(id!),
    enabled: id !== undefined,
  })
}

export function useProductMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: productKeys.all })

  return {
    create: useMutation({ mutationFn: storeProducts.create, onSuccess: invalidate }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: number; body: StoreProductUpdateRequest }) => storeProducts.update(id, body),
      onSuccess: invalidate,
    }),
    remove: useMutation({ mutationFn: storeProducts.delete, onSuccess: invalidate }),
  }
}
