import { Banknote, Copy, Ellipsis, Info, Pencil, Trash2 } from 'lucide-react'
import type { StoreProduct } from '@/api/routes/stores-products/storeProducts.types'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusMenu } from '@/components/ui/menu/CusMenu'

/** ⋯ menyusidagi amallar. Qatorni/kartani bosish — view (to'liq ma'lumot) */
export type ProductAction = 'view' | 'edit' | 'price' | 'duplicate' | 'delete'

interface ProductActionsMenuProps {
  product: StoreProduct
  onAction: (action: ProductAction, product: StoreProduct) => void
}

/** Mahsulot amallari menyusi (jadval va kartalarda bir xil). Bosilishi qator/kartaga o'tmaydi */
export function ProductActionsMenu({ product, onAction }: ProductActionsMenuProps) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <CusMenu
        trigger={<CusIconButton icon={Ellipsis} label="Amallar" size="sm" />}
        items={[
          { value: 'view', label: "Ma'lumot", icon: <Info className="size-4" /> },
          { value: 'edit', label: 'Tahrirlash', icon: <Pencil className="size-4" /> },
          { value: 'price', label: "Narxni o'zgartirish", icon: <Banknote className="size-4" /> },
          { value: 'duplicate', label: 'Nusxa olish', icon: <Copy className="size-4" /> },
          { separator: true },
          { value: 'delete', label: "O'chirish", icon: <Trash2 className="size-4" />, isDanger: true },
        ]}
        onSelect={(value) => onAction(value as ProductAction, product)}
      />
    </div>
  )
}
