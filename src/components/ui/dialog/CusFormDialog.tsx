import { useId, type FormEvent, type ReactNode } from 'react'
import { CusButton } from '../buttons/CusButton'
import { CusDialog } from './CusDialog'

interface CusFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: ReactNode
  onSubmit: (event: FormEvent) => void
  isSaving?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  submitText?: string
  children: ReactNode
}

/**
 * Forma modali: sarlavha, maydonlar, "Bekor qilish" / "Saqlash".
 * Tashqariga bosilganda yopilmaydi — kiritilgan ma'lumot tasodifan yo'qolmasin.
 */
export function CusFormDialog({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  isSaving,
  size = 'md',
  submitText = 'Saqlash',
  children,
}: CusFormDialogProps) {
  const formId = useId()

  return (
    <CusDialog
      open={open}
      onOpenChange={onOpenChange}
      size={size}
      title={title}
      description={description}
      isPersistent
      footer={
        <>
          <CusButton variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </CusButton>
          <CusButton type="submit" form={formId} isLoading={isSaving}>
            {submitText}
          </CusButton>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {children}
      </form>
    </CusDialog>
  )
}
