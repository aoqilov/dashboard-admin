import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'

interface CrudApi<T, Req, UpdateReq> {
  create: (body: Req) => Promise<T>
  update: (id: number, body: UpdateReq) => Promise<T>
  delete: (id: number) => Promise<void>
}

/**
 * Oddiy CRUD route uchun create / update / remove mutatsiyalari.
 * Muvaffaqiyatdan keyin `queryKey` bilan boshlanadigan barcha so'rovlar yangilanadi.
 */
export function useCrudMutations<T, Req, UpdateReq>(queryKey: QueryKey, api: CrudApi<T, Req, UpdateReq>) {
  const queryClient = useQueryClient()
  const onSuccess = () => queryClient.invalidateQueries({ queryKey })

  return {
    create: useMutation({ mutationFn: (body: Req) => api.create(body), onSuccess }),
    update: useMutation({
      mutationFn: ({ id, body }: { id: number; body: UpdateReq }) => api.update(id, body),
      onSuccess,
    }),
    remove: useMutation({ mutationFn: (id: number) => api.delete(id), onSuccess }),
  }
}
