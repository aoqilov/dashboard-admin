import { useStoredChoice } from '@/hooks/useStoredChoice'

/** Mahsulotlar ko'rinishi: jadval, 12 / 8 / 6 ustunli rasmli to'r, 4 ustunli [rasm][ma'lumot] kartalar */
export type ProductLayout = 'table' | 'grid12' | 'grid8' | 'grid6' | 'grid4'

export const PRODUCT_LAYOUTS: ProductLayout[] = ['table', 'grid12', 'grid8', 'grid6', 'grid4']

/** Tanlangan ko'rinish localStorage da saqlanadi */
export function useProductLayout() {
  return useStoredChoice<ProductLayout>('products-layout', PRODUCT_LAYOUTS, 'table')
}
