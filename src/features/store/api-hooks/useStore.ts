import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAll } from '@/api/fetchAll'
import { storeAddresses } from '@/api/routes/stores-addresses/storeAddresses.api'
import { storeContacts } from '@/api/routes/stores-contacts/storeContacts.api'
import { storeIcons } from '@/api/routes/stores-icons/storeIcons.api'
import { storeServices } from '@/api/routes/stores-services/storeServices.api'
import { storeSocialLinks } from '@/api/routes/stores-social-links/storeSocialLinks.api'
import { store } from '@/api/routes/stores-store/store.api'
import type { StoreUpdateRequest } from '@/api/routes/stores-store/store.types'
import { useCrudMutations } from '@/hooks/useCrudMutations'

export const storeKeys = {
  info: ['store'],
  addresses: ['store-addresses'],
  contacts: ['store-contacts'],
  services: ['store-services'],
  socialLinks: ['store-social-links'],
  icons: ['store-icons'],
} as const

/** Joriy do'kon (admin o'z do'konini ko'radi) */
export function useStoreInfo() {
  return useQuery({ queryKey: storeKeys.info, queryFn: () => store.get() })
}

/** Do'kon ma'lumotlarini tahrirlash — javob keshga yoziladi */
export function useUpdateStoreInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: StoreUpdateRequest) => store.update(body),
    onSuccess: (data) => queryClient.setQueryData(storeKeys.info, data),
  })
}

export function useAddresses() {
  return useQuery({ queryKey: storeKeys.addresses, queryFn: () => fetchAll(storeAddresses.getAll) })
}

export function useContacts() {
  return useQuery({ queryKey: storeKeys.contacts, queryFn: () => fetchAll(storeContacts.getAll) })
}

export function useServices() {
  return useQuery({ queryKey: storeKeys.services, queryFn: () => fetchAll(storeServices.getAll) })
}

export function useSocialLinks() {
  return useQuery({ queryKey: storeKeys.socialLinks, queryFn: () => fetchAll(storeSocialLinks.getAll) })
}

/** Xizmat ikonkalari — kam o'zgaradi */
export function useIcons() {
  return useQuery({ queryKey: storeKeys.icons, queryFn: () => fetchAll(storeIcons.getAll), staleTime: 5 * 60_000 })
}

export const useAddressMutations = () => useCrudMutations(storeKeys.addresses, storeAddresses)
export const useContactMutations = () => useCrudMutations(storeKeys.contacts, storeContacts)
export const useServiceMutations = () => useCrudMutations(storeKeys.services, storeServices)
export const useSocialLinkMutations = () => useCrudMutations(storeKeys.socialLinks, storeSocialLinks)
export const useIconMutations = () => useCrudMutations(storeKeys.icons, storeIcons)
