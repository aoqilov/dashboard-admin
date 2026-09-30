import type { Theme } from '@/context/ThemeContext'

/**
 * JS ichida kerak bo'ladigan ranglar (grafiklar).
 * Qiymatlar src/index.css dagi @theme bilan bir xil bo'lishi kerak.
 * Asosiy (accent) rang bu yerda yo'q — getAccentColor(accent, theme) dan olinadi.
 */
export const COLORS = {
  danger: '#dc3545',
  success: '#1cbb8c',
  info: '#17a2b8',
  warning: '#fcb92c',
  dark: '#212529',
} as const

/** Temaga bog'liq grafik ranglari (index.css dagi .dark bilan mos) */
export const CHART_THEME: Record<Theme, { surface: string; border: string; muted: string }> = {
  light: { surface: '#ffffff', border: '#e2e6ea', muted: '#6c757d' },
  dark: { surface: '#1a2430', border: '#253241', muted: '#939ba2' },
}
