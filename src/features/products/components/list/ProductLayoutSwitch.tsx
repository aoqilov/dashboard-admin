import { Grid3x3, Grip, LayoutGrid, LayoutList, Table2 } from 'lucide-react'
import { LayoutSwitch, type LayoutOption } from '@/components/shared/layout-switch/LayoutSwitch'
import type { ProductLayout } from '../../utils/productLayout'

const OPTIONS: LayoutOption<ProductLayout>[] = [
  { value: 'table', label: 'Jadval', icon: Table2 },
  { value: 'grid12', label: "12 ustunli to'r", icon: Grip },
  { value: 'grid8', label: "8 ustunli to'r", icon: Grid3x3 },
  { value: 'grid6', label: "6 ustunli to'r", icon: LayoutGrid },
  { value: 'grid4', label: "4 ustun: rasm va ma'lumot", icon: LayoutList },
]

interface ProductLayoutSwitchProps {
  value: ProductLayout
  onChange: (value: ProductLayout) => void
}

/** Ko'rinish almashtirgich: jadval / 12 / 8 / 6 / 4 ustun */
export function ProductLayoutSwitch({ value, onChange }: ProductLayoutSwitchProps) {
  return <LayoutSwitch options={OPTIONS} value={value} onChange={onChange} />
}
