import type { StoreContact, StoreContactRequest } from '@/api/routes/stores-contacts/storeContacts.types'
import { CusFormDialog } from '@/components/ui/dialog/CusFormDialog'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusPhoneInput } from '@/components/ui/inputs/CusPhoneInput'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { parseUzPhone, toUzPhone, UZ_PHONE_LENGTH } from '@/utils/phone'
import { useContactMutations } from '../api-hooks/useStore'
import type { CrudModalProps } from '../components/CrudSection'

interface Values {
  name: string
  role: string
  /** 9 ta raqam, +998 siz */
  phone: string
  hours: string
  telegram: string
  has_telegram: boolean
}

function toValues(item: StoreContact | null): Values {
  return {
    name: item?.name ?? '',
    role: item?.role ?? '',
    phone: parseUzPhone(item?.phone),
    hours: item?.hours ?? '',
    telegram: item?.telegram ?? '',
    has_telegram: item?.has_telegram ?? false,
  }
}

function validate(values: Values): FormErrors<Values> {
  return {
    name: values.name.trim() ? undefined : 'Ismini kiriting',
    phone: !values.phone || values.phone.length === UZ_PHONE_LENGTH ? undefined : "Raqam to'liq emas",
  }
}

function toRequest(values: Values): StoreContactRequest {
  return {
    name: values.name.trim(),
    role: values.role.trim(),
    phone: values.phone ? toUzPhone(values.phone) : '',
    hours: values.hours.trim(),
    telegram: values.telegram.trim(),
    has_telegram: values.has_telegram,
  }
}

/** Aloqa uchun shaxsni qo'shish / tahrirlash */
export function ContactModal({ item, open, onOpenChange }: CrudModalProps<StoreContact>) {
  const { create, update } = useContactMutations()
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: toValues(item),
    validate,
    toRequest,
    save: (body) => (item ? update.mutateAsync({ id: item.id, body }) : create.mutateAsync(body)),
    successText: item ? 'Saqlandi' : "Kontakt qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  return (
    <CusFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Kontaktni tahrirlash' : 'Yangi kontakt'}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <CusInput
          label="Ism *"
          autoFocus
          maxLength={150}
          placeholder="Aziza"
          value={values.name}
          error={errors.name}
          onChange={(event) => set('name', event.target.value)}
        />
        <CusInput
          label="Lavozim"
          maxLength={150}
          placeholder="Sotuv menejeri"
          value={values.role}
          error={errors.role}
          onChange={(event) => set('role', event.target.value)}
        />
        <CusPhoneInput
          label="Telefon"
          size="md"
          value={values.phone}
          errorText={errors.phone}
          onChange={(digits) => set('phone', digits)}
        />
        <CusInput
          label="Ish vaqti"
          maxLength={255}
          placeholder="09:00–18:00"
          value={values.hours}
          error={errors.hours}
          onChange={(event) => set('hours', event.target.value)}
        />
      </div>
      <CusInput
        label="Telegram"
        maxLength={150}
        placeholder="@username"
        value={values.telegram}
        error={errors.telegram}
        onChange={(event) => set('telegram', event.target.value)}
      />
      <CusSwitch checked={values.has_telegram} onChange={(checked) => set('has_telegram', checked)}>
        Telegram orqali yozish mumkin
      </CusSwitch>
    </CusFormDialog>
  )
}
