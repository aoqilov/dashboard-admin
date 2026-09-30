import type { Theme } from '@/context/ThemeContext'

/** Asosiy (accent) rang. Qiymatlar src/index.css dagi [data-accent] bloklariga mos */
export type Accent = 'blue' | 'red' | 'green' | 'dark'

export const DEFAULT_ACCENT: Accent = 'blue'

/**
 * Settings'dagi tanlov ro'yxati.
 * `chart` — JS kerak bo'lgan joylar uchun hex (ApexCharts CSS o'zgaruvchini tushunmaydi)
 */
export const ACCENTS: { value: Accent; label: string; chart: Record<Theme, string> }[] = [
  { value: 'blue', label: "Ko'k", chart: { light: '#3b7ddd', dark: '#3b7ddd' } },
  { value: 'red', label: 'Qizil', chart: { light: '#f04438', dark: '#f04438' } },
  { value: 'green', label: 'Yashil', chart: { light: '#039855', dark: '#12b76a' } },
  { value: 'dark', label: "Qora", chart: { light: '#18181b', dark: '#a1a1aa' } },
]

export function isAccent(value: unknown): value is Accent {
  return ACCENTS.some((accent) => accent.value === value)
}

/** Grafiklar uchun joriy accent rangi (hex) */
export function getAccentColor(accent: Accent, theme: Theme) {
  return (ACCENTS.find((item) => item.value === accent) ?? ACCENTS[0]).chart[theme]
}
