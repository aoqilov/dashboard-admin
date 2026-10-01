import type { StoreAddress, StoreAddressRequest } from '@/api/routes/stores-addresses/storeAddresses.types'
import { CusFormDialog } from '@/components/ui/dialog/CusFormDialog'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusPhoneInput } from '@/components/ui/inputs/CusPhoneInput'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { parseUzPhone, toUzPhone, UZ_PHONE_LENGTH } from '@/utils/phone'
import { useAddressMutations } from '../api-hooks/useStore'
import type { CrudModalProps } from '../components/CrudSection'

interface Values {
  name: string
  address: string
  landmark: string
  working_hours: string
  /** 9 ta raqam, +998 siz */
  phone: string
}

function toValues(item: StoreAddress | null): Values {
  return {
    name: item?.name ?? '',
    address: item?.address ?? '',
    landmark: item?.landmark ?? '',
    working_hours: item?.working_hours ?? '',
    phone: parseUzPhone(item?.phone),
  }
}

function validate(values: Values): FormErrors<Values> {
  return {
    name: values.name.trim() ? undefined : 'Nomini kiriting',
    address: values.address.trim() ? undefined : 'Manzilni kiriting',
    phone: !values.phone || values.phone.length === UZ_PHONE_LENGTH ? undefined : "Raqam to'liq emas",
  }
}

function toRequest(values: Values): StoreAddressRequest {
  return {
    name: values.name.trim(),
    address: values.address.trim(),
    landmark: values.landmark.trim(),
    working_hours: values.working_hours.trim(),
    phone: values.phone ? toUzPhone(values.phone) : '',
  }
}

/** Filial manzilini qo'shish / tahrirlash */
export function AddressModal({ item, open, onOpenChange }: CrudModalProps<StoreAddress>) {
  const { create, update } = useAddressMutations()
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: toValues(item),
    validate,
    toRequest,
    save: (body) => (item ? update.mutateAsync({ id: item.id, body }) : create.mutateAsync(body)),
    successText: item ? 'Saqlandi' : "Manzil qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  return (
    <CusFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Manzilni tahrirlash' : 'Yangi manzil'}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <CusInput
        label="Nomi *"
        autoFocus
        maxLength={150}
        placeholder="Chilonzor filiali"
        value={values.name}
        error={errors.name}
        onChange={(event) => set('name', event.target.value)}
      />
      <CusTextArea
        label="Manzil"
        isRequired
        rows={2}
        maxLength={500}
        placeholder="Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 1"
        value={values.address}
        errorText={errors.address}
        onChange={(event) => set('address', event.target.value)}
      />
      <CusInput
        label="Mo'ljal"
        maxLength={255}
        placeholder="Metro yonida"
        value={values.landmark}
        error={errors.landmark}
        onChange={(event) => set('landmark', event.target.value)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <CusInput
          label="Ish vaqti"
          maxLength={255}
          placeholder="Du–Sha, 09:00–20:00"
          value={values.working_hours}
          error={errors.working_hours}
          onChange={(event) => set('working_hours', event.target.value)}
        />
        <CusPhoneInput
          label="Telefon"
          size="md"
          value={values.phone}
          errorText={errors.phone}
          onChange={(digits) => set('phone', digits)}
        />
      </div>
    </CusFormDialog>
  )
}
