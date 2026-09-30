import { QueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // 4xx xatolarda (ruxsat yo'q, topilmadi) qayta urinish befoyda
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status && status >= 400 && status < 500) return false
        return failureCount < 1
      },
    },
    mutations: {
      retry: 0,
    },
  },
})

export default queryClient
