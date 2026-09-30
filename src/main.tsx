import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import '@/index.css'
import '@/api/api-config/interceptors'
import queryClient from '@/api/api-config/queryClient'
import { CusToaster } from '@/components/ui/toaster/CusToaster'
import { ThemeProvider } from '@/context/ThemeProvider'
import { system } from '@/style/chakra-system'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ChakraProvider value={system}>
          <App />
          <CusToaster />
        </ChakraProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
