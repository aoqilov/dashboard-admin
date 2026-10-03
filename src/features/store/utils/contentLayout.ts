import { LayoutGrid, List, Table2 } from 'lucide-react'
import type { LayoutOption } from '@/components/shared/layout-switch/LayoutSwitch'
import { useStoredChoice } from '@/hooks/useStoredChoice'

/** Chegirma/yangilik ko'rinishi: jadval, kartalar to'ri, rasmli ro'yxat */
export type ContentLayout = 'table' | 'grid' | 'list'

export const CONTENT_LAYOUTS: ContentLayout[] = ['table', 'grid', 'list']

export const CONTENT_LAYOUT_OPTIONS: LayoutOption<ContentLayout>[] = [
  { value: 'table', label: 'Jadval', icon: Table2 },
  { value: 'grid', label: "Kartalar to'ri", icon: LayoutGrid },
  { value: 'list', label: "Ro'yxat", icon: List },
]

/** Tanlangan ko'rinish localStorage da saqlanadi (key — sahifa uchun alohida) */
export function useContentLayout(key: string) {
  return useStoredChoice<ContentLayout>(key, CONTENT_LAYOUTS, 'table')
}
