import {
  Box,
  FileText,
  House,
  Layers,
  type LucideIcon,
  Package,
  Percent,
  Settings,
  ShoppingBag,
} from 'lucide-react'

export interface MenuChild {
  id: string
  label: string
}

export interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  /** Bo'lmasa element o'zi sahifa (submenu yo'q) */
  children?: MenuChild[]
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

/** id lar App.tsx dagi ROUTES bilan mos bo'lishi kerak */
export const SIDEBAR_NAV: MenuGroup[] = [
  {
    title: 'Asosiy',
    items: [{ id: 'overview', label: 'Dashboard', icon: House }],
  },
  {
    title: 'Katalog',
    items: [
      { id: 'products', label: 'Products', icon: Package },
      { id: 'categories', label: 'Categories', icon: Layers },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { id: 'discounts', label: 'Скидки', icon: Percent },
      { id: 'news', label: 'News', icon: FileText },
    ],
  },
  {
    title: "Do'kon",
    items: [
      { id: 'store', label: 'Магазин', icon: ShoppingBag },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
  {
    title: 'Others',
    items: [{ id: 'ui-kit', label: 'UI Elements', icon: Box }],
  },
]
