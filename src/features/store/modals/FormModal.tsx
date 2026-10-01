import { useId, type FormEvent, type ReactNode } from 'react'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusDialog } from '@/components/ui/dialog/CusDialog'

interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onSubmit: (event: FormEvent) => void
  isSaving?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

/** Forma modali asosi: sarlavha, maydonlar, "Bekor qilish" / "Saqlash" */
export function FormModal({
  open,
  onOpenChange,
  title,
  description,
  onSubmit,
  isSaving,
  size = 'md',
  children,
}: FormModalProps) {
  const formId = useId()

  return (
    <CusDialog
      open={open}
      onOpenChange={onOpenChange}
      size={size}
      title={title}
      description={description}
      isPersistent={isSaving}
      footer={
        <>
          <CusButton variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </CusButton>
          <CusButton type="submit" form={formId} isLoading={isSaving}>
            Saqlash
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
