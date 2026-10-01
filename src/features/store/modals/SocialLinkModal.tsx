import type {
  Platform,
  StoreSocialLink,
  StoreSocialLinkRequest,
} from '@/api/routes/stores-social-links/storeSocialLinks.types'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusSelect } from '@/components/ui/select/CusSelect'
import { useEntityForm, type FormErrors } from '@/hooks/useEntityForm'
import { isUrl, normalizeUrl } from '@/utils/validate'
import { useSocialLinkMutations } from '../api-hooks/useStore'
import type { CrudModalProps } from '../components/CrudSection'
import { PLATFORMS } from '../utils/storeTabs'
import { FormModal } from './FormModal'

/** Backend URLField chegarasi */
const URL_MAX = 200

const PLATFORM_OPTIONS = (Object.keys(PLATFORMS) as Platform[]).map((value) => ({
  value,
  label: PLATFORMS[value].label,
}))

interface Values {
  platform: Platform
  nickname: string
  url: string
  visible: boolean
}

function toValues(item: StoreSocialLink | null): Values {
  return {
    platform: item?.platform ?? 'instagram',
    nickname: item?.nickname ?? '',
    url: item?.url ?? '',
    visible: item?.visible ?? true,
  }
}

function validate(values: Values): FormErrors<Values> {
  const url = normalizeUrl(values.url)
  return {
    url: !url
      ? 'Havolani kiriting'
      : !isUrl(url)
        ? "Havola noto'g'ri"
        : url.length > URL_MAX
          ? `Havola ${URL_MAX} belgidan oshmasin`
          : undefined,
  }
}

function toRequest(values: Values): StoreSocialLinkRequest {
  return {
    platform: values.platform,
    nickname: values.nickname.trim(),
    url: normalizeUrl(values.url),
    visible: values.visible,
  }
}

/** Ijtimoiy tarmoq havolasini qo'shish / tahrirlash */
export function SocialLinkModal({ item, open, onOpenChange }: CrudModalProps<StoreSocialLink>) {
  const { create, update } = useSocialLinkMutations()
  const { values, errors, set, handleSubmit, isSaving } = useEntityForm({
    initial: toValues(item),
    validate,
    toRequest,
    save: (body) => (item ? update.mutateAsync({ id: item.id, body }) : create.mutateAsync(body)),
    successText: item ? 'Saqlandi' : "Havola qo'shildi",
    onSuccess: () => onOpenChange(false),
  })

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={item ? 'Havolani tahrirlash' : 'Yangi havola'}
      onSubmit={handleSubmit}
      isSaving={isSaving}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <CusSelect
          label="Platforma"
          isRequired
          size="md"
          options={PLATFORM_OPTIONS}
          errorText={errors.platform}
          value={[values.platform]}
          onChange={([value]) => value && set('platform', value as Platform)}
        />
        <CusInput
          label="Nickname"
          maxLength={150}
          placeholder="@shop"
          value={values.nickname}
          error={errors.nickname}
          onChange={(event) => set('nickname', event.target.value)}
        />
      </div>
      <CusInput
        label="Havola *"
        type="url"
        maxLength={URL_MAX}
        placeholder={PLATFORMS[values.platform].placeholder}
        hint="https:// yozilmasa o'zi qo'shiladi"
        value={values.url}
        error={errors.url}
        onChange={(event) => set('url', event.target.value)}
      />
      <CusSwitch checked={values.visible} onChange={(checked) => set('visible', checked)}>
        Saytda ko'rinadi
      </CusSwitch>
    </FormModal>
  )
}
