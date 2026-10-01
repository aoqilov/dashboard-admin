import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { StoreService, StoreServiceRequest } from '@/api/routes/stores-services/storeServices.types'
import { CusFormDialog } from '@/components/ui/dialog/CusFormDialog'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { useIcons, useServiceMutations } from '../api-hooks/useStore'
import type { CrudModalProps } from '../components/CrudSection'
import { IconModal } from './IconModal'

interface Values {
  /** Icon id (select uchun string) */
  icon: string
  title: string
  kicker: string
  description: string
  visible: boolean
}

function toValues(item: StoreService | null): Values {
  return {
    icon: item ? String(item.icon) : '',
    title: item?.title ?? '',
    kicker: item?.kicker ?? '',
    description: item?.description ?? '',
    visible: item?.visible ?? true,
  }
}

function validate(values: Values): FormErrors<Values> {
  return {
    icon: values.icon ? undefined : 'Ikonkani tanlang',
    title: values.title.trim() ? undefined : 'Sarlavhani kiriting',
  }
}

function toRequest(values: Values): StoreServiceRequest {
  return {
    icon: Number(values.icon),
    title: values.title.trim(),
    kicker: values.kicker.trim(),
    description: values.description.trim(),
    visible: values.visible,
  }
}

/** Do'kon xizmatini qo'shish / tahrirlash (tikish, yetkazib berish ...) */
export function ServiceModal({ item, open, onOpenChange }: CrudModalProps<StoreService>) {
  const { data: icons = [], isLoading: iconsLoading } = useIcons()
  const { create, update } = useServiceMutations()
  const [iconModal, setIconModal] = useState(false)
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: toValues(item),
    validate,
    toRequest,
    save: (body) => (item ? update.mutateAsync({ id: item.id, body }) : create.mutateAsync(body)),
    successText: item ? 'Saqlandi' : "Xizmat qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  return (
    <>
      <CusFormDialog
        open={open}
        onOpenChange={onOpenChange}
        title={item ? 'Xizmatni tahrirlash' : 'Yangi xizmat'}
        onSubmit={handleSubmit}
        isSaving={isSaving}
      >
        <CusInput
          label="Sarlavha *"
          autoFocus
          maxLength={255}
          placeholder="Individual tikish"
          value={values.title}
          error={errors.title}
          onChange={(event) => set('title', event.target.value)}
        />
        <CusInput
          label="Qisqa yozuv"
          maxLength={255}
          placeholder="Atelye"
          hint="Sarlavha ustida kichik matn"
          value={values.kicker}
          error={errors.kicker}
          onChange={(event) => set('kicker', event.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <CusSelect
            label="Ikonka"
            isRequired
            size="md"
            placeholder={iconsLoading ? 'Yuklanmoqda...' : icons.length ? 'Tanlang' : "Ikonkalar yo'q"}
            errorText={errors.icon}
            options={icons.map((icon) => ({ label: icon.name, value: String(icon.id) }))}
            value={values.icon ? [values.icon] : []}
            onChange={([value]) => set('icon', value ?? '')}
          />
          <button
            type="button"
            onClick={() => setIconModal(true)}
            className="flex items-center gap-1 self-start text-xs font-medium text-primary hover:underline dark:text-primary-light"
          >
            <Plus className="size-3.5" /> Yangi ikonka
          </button>
        </div>
        <CusTextArea
          label="Tavsif"
          rows={3}
          placeholder="Xizmat haqida qisqacha"
          value={values.description}
          errorText={errors.description}
          onChange={(event) => set('description', event.target.value)}
        />
        <CusSwitch checked={values.visible} onChange={(checked) => set('visible', checked)}>
          Saytda ko'rinadi
        </CusSwitch>
      </CusFormDialog>

      {/* Forma tashqarisida — ichki forma submit'i tashqi formaga o'tmasin */}
      {iconModal && (
        <IconModal open onOpenChange={setIconModal} onCreated={(icon) => set('icon', String(icon.id))} />
      )}
    </>
  )
}
