import { useMutation } from '@tanstack/react-query'
import { saveTokens } from '@/api/api-config/tokenStorage'
import { storeAuth } from '@/api/routes/stores-auth/storeAuth.api'

/** Do'kon admini kirishi: muvaffaqiyatli bo'lsa tokenlar saqlanadi */
export function useLogin() {
  return useMutation({
    mutationFn: storeAuth.login,
    onSuccess: (tokens) => saveTokens(tokens),
  })
}
