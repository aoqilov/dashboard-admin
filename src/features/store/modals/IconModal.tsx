import type { Icon, IconRequest } from '@/api/routes/stores-icons/storeIcons.types'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { useIconMutations } from '../api-hooks/useStore'
import { FormModal } from './FormModal'

interface Values {
  name: string
}

const validate = (values: Values): FormErrors<Values> => ({
  name: values.name.trim() ? undefined : 'Nomini kiriting',
})

const toRequest = (values: Values): IconRequest => ({ name: values.name.trim() })

interface IconModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Yaratilgan ikonka — xizmat formasida darhol tanlanadi */
  onCreated: (icon: Icon) => void
}

/** Xizmat formasidan tezkor ikonka qo'shish */
export function IconModal({ open, onOpenChange, onCreated }: IconModalProps) {
  const { create } = useIconMutations()
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: { name: '' },
    validate,
    toRequest,
    save: async (body) => onCreated(await create.mutateAsync(body)),
    successText: "Ikonka qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title="Yangi ikonka"
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <CusInput
        label="Nomi *"
        autoFocus
        maxLength={100}
        value={values.name}
        error={errors.name}
        onChange={(event) => set('name', event.target.value)}
      />
    </FormModal>
  )
}
