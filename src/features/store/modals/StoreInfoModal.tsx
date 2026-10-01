import type { Store, StoreUpdateRequest } from '@/api/routes/stores-store/store.types'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusPhoneInput } from '@/components/ui/inputs/CusPhoneInput'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { parseUzPhone, toUzPhone, UZ_PHONE_LENGTH } from '@/utils/phone'
import { isEmail } from '@/utils/validate'
import { useUpdateStoreInfo } from '../api-hooks/useStore'
import { FormModal } from './FormModal'

interface Values {
  name: string
  description: string
  /** 9 ta raqam, +998 siz */
  phone: string
  email: string
}

function toValues(store: Store): Values {
  return {
    name: store.name,
    description: store.description ?? '',
    phone: parseUzPhone(store.phone),
    email: store.email ?? '',
  }
}

function validate(values: Values): FormErrors<Values> {
  const email = values.email.trim()
  return {
    name: values.name.trim() ? undefined : "Do'kon nomini kiriting",
    phone: !values.phone || values.phone.length === UZ_PHONE_LENGTH ? undefined : "Raqam to'liq emas",
    email: !email || isEmail(email) ? undefined : "Email noto'g'ri",
  }
}

function toRequest(values: Values): StoreUpdateRequest {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    phone: values.phone ? toUzPhone(values.phone) : '',
    email: values.email.trim(),
  }
}

interface StoreInfoModalProps {
  store: Store
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Do'konning asosiy ma'lumotlari: nomi, tavsif, telefon, email */
export function StoreInfoModal({ store, open, onOpenChange }: StoreInfoModalProps) {
  const updateInfo = useUpdateStoreInfo()
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: toValues(store),
    validate,
    toRequest,
    save: (body) => updateInfo.mutateAsync(body),
    successText: 'Saqlandi',
    onSuccess: () => onOpenChange(false),
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Do'kon ma'lumotlari"
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <CusInput
        label="Nomi *"
        autoFocus
        maxLength={255}
        value={values.name}
        error={errors.name}
        onChange={(event) => set('name', event.target.value)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <CusPhoneInput
          label="Telefon"
          size="md"
          value={values.phone}
          errorText={errors.phone}
          onChange={(digits) => set('phone', digits)}
        />
        <CusInput
          label="Email"
          type="email"
          maxLength={254}
          placeholder="info@shop.uz"
          value={values.email}
          error={errors.email}
          onChange={(event) => set('email', event.target.value)}
        />
      </div>
      <CusTextArea
        label="Tavsif"
        rows={4}
        placeholder="Do'kon haqida qisqacha"
        value={values.description}
        errorText={errors.description}
        onChange={(event) => set('description', event.target.value)}
      />
    </FormModal>
  )
}
