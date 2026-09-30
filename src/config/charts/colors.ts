import type { Theme } from '@/context/ThemeContext'

/**
 * JS ichida kerak bo'ladigan ranglar (grafiklar).
 * Qiymatlar src/index.css dagi @theme bilan bir xil bo'lishi kerak.
 */
export const COLORS = {
  primary: '#465fff',
  primaryLight: '#7592ff',
  danger: '#f04438',
  success: '#12b76a',
  info: '#0ba5ec',
  warning: '#fb6514',
  dark: '#1d2939',
} as const

/** Temaga bog'liq grafik ranglari (index.css dagi .dark bilan mos) */
export const CHART_THEME: Record<Theme, { surface: string; border: string; muted: string }> = {
  light: { surface: '#ffffff', border: '#e4e7ec', muted: '#667085' },
  dark: { surface: '#212124', border: '#2f2f34', muted: '#a1a1aa' },
}
