import { useState } from 'react'

/** Mahsulotlar ko'rinishi: jadval, 12 / 8 / 6 ustunli rasmli to'r, 4 ustunli [rasm][ma'lumot] kartalar */
export type ProductLayout = 'table' | 'grid12' | 'grid8' | 'grid6' | 'grid4'

export const PRODUCT_LAYOUTS: ProductLayout[] = ['table', 'grid12', 'grid8', 'grid6', 'grid4']

const STORAGE_KEY = 'products-layout'

function readLayout(): ProductLayout {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return PRODUCT_LAYOUTS.find((layout) => layout === value) ?? 'table'
  } catch {
    return 'table'
  }
}

/** Tanlangan ko'rinish localStorage da saqlanadi */
export function useProductLayout() {
  const [layout, setLayout] = useState<ProductLayout>(readLayout)

  const update = (next: ProductLayout) => {
    setLayout(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // saqlab bo'lmasa ham ko'rinish almashadi
    }
  }

  return [layout, update] as const
}
