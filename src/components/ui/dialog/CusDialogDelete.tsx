import type { ReactNode } from 'react'
import { TriangleAlert } from 'lucide-react'
import { CusButton } from '../buttons/CusButton'
import { CusDialog } from './CusDialog'

interface CusDialogDeleteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: string
  description?: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isLoading?: boolean
}

/** O'chirishni tasdiqlash oynasi */
export function CusDialogDelete({
  open,
  onOpenChange,
  trigger,
  title = "O'chirishni tasdiqlaysizmi?",
  description = "Bu amalni ortga qaytarib bo'lmaydi.",
  confirmText = "O'chirish",
  cancelText = 'Bekor qilish',
  onConfirm,
  isLoading,
}: CusDialogDeleteProps) {
  return (
    <CusDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      size="sm"
      footer={
        <>
          <CusButton variant="outline" onClick={() => onOpenChange?.(false)}>
            {cancelText}
          </CusButton>
          <CusButton variant="danger" isLoading={isLoading} onClick={onConfirm}>
            {confirmText}
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 pt-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-danger/10 text-danger">
          <TriangleAlert className="size-7" />
        </span>
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-heading">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
    </CusDialog>
  )
}
