import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { DEFAULT_ACCENT, isAccent, type Accent } from '@/theme/accents'
import { ThemeContext, type Theme } from './ThemeContext'

const STORAGE_KEY = 'theme'
const ACCENT_KEY = 'accent'

/** Saqlangan tanlov, bo'lmasa tizim sozlamasi */
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage yopiq bo'lishi mumkin (private rejim)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getInitialAccent(): Accent {
  try {
    const saved = localStorage.getItem(ACCENT_KEY)
    if (isAccent(saved)) return saved
  } catch {
    // localStorage yopiq bo'lishi mumkin
  }
  return DEFAULT_ACCENT
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [accent, setAccent] = useState<Accent>(getInitialAccent)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // saqlab bo'lmasa ham tema ishlayveradi
    }
  }, [theme])

  // index.css dagi [data-accent] bloklari --brand-* ranglarini almashtiradi
  useEffect(() => {
    document.documentElement.dataset.accent = accent
    try {
      localStorage.setItem(ACCENT_KEY, accent)
    } catch {
      // saqlab bo'lmasa ham rang ishlayveradi
    }
  }, [accent])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>{children}</ThemeContext.Provider>
  )
}
