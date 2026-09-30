import { createContext } from 'react'
import type { Accent } from '@/theme/accents'

export type Theme = 'light' | 'dark'

export interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  accent: Accent
  setAccent: (accent: Accent) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
