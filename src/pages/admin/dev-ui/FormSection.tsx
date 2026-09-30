import { useState } from 'react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusDatePicker } from '@/components/ui/calendar/CusDatePicker'
import { CusCheckbox, CusCheckboxGroup } from '@/components/ui/inputs/CusCheckbox'
import { CusFileUpload } from '@/components/ui/inputs/CusFileUpload'
import { CusNumberInput } from '@/components/ui/inputs/CusNumberInput'
import { CusPasswordInput } from '@/components/ui/inputs/CusPasswordInput'
import { CusPinInput } from '@/components/ui/inputs/CusPinInput'
import { CusRadioGroup } from '@/components/ui/inputs/CusRadioGroup'
import { CusRating } from '@/components/ui/inputs/CusRating'
import { CusSlider } from '@/components/ui/inputs/CusSlider'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusTagsInput } from '@/components/ui/inputs/CusTagsInput'
import { CusTextArea } from '@/components/ui/inputs/CusTextArea'
import { CusCombobox } from '@/components/ui/select/CusCombobox'
import { CusNativeSelect } from '@/components/ui/select/CusNativeSelect'
import { CusSelect, type SelectOption } from '@/components/ui/select/CusSelect'
import { DevRow } from './DevRow'

const COUNTRIES: SelectOption[] = [
  { label: 'Uzbekistan', value: 'uz' },
  { label: 'Kazakhstan', value: 'kz' },
  { label: 'United States', value: 'us' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp', isDisabled: true },
]

/** Chakra asosidagi forma elementlari */
export function FormSection() {
  const [agree, setAgree] = useState(true)
  const [notify, setNotify] = useState(true)
  const [date, setDate] = useState('2026-09-29')
  const [price, setPrice] = useState([20, 80])

  return (
    <CusCard>
      <CusCardHeader title="Forms — Chakra" />

      <DevRow title="Select / Combobox / NativeSelect / DatePicker" className="grid items-start gap-5 md:grid-cols-2">
        <CusSelect label="Country" options={COUNTRIES} defaultValue={['uz']} clearable />
        <CusSelect label="Countries (multiple)" options={COUNTRIES} multiple placeholder="Bir nechtasini tanlang" />
        <CusCombobox label="Search country" options={COUNTRIES} />
        <CusNativeSelect label="Native select" options={COUNTRIES} placeholder="Tanlang" />
        <CusDatePicker label="Date" value={date} onChange={setDate} helperText={`Tanlangan: ${date || '—'}`} />
        <CusNumberInput label="Price" defaultValue={1200} min={0} formatOptions={{ style: 'currency', currency: 'USD' }} />
      </DevRow>

      <DevRow title="Password / TextArea / Tags / PIN" className="grid items-start gap-5 md:grid-cols-2">
        <CusPasswordInput label="Password" placeholder="••••••••" isRequired />
        <CusTagsInput label="Tags" defaultValue={['react', 'chakra']} />
        <CusTextArea label="Bio" placeholder="O'zingiz haqingizda..." errorText="Kamida 20 ta belgi" />
        <CusPinInput label="SMS kod" length={4} otp helperText="Telefoningizga yuborilgan kod" />
      </DevRow>

      <DevRow title="Checkbox / Radio / Switch" className="items-start gap-x-12 gap-y-6">
        <div className="flex flex-col gap-3">
          <CusCheckbox checked={agree} onChange={setAgree}>
            Shartlarga roziman
          </CusCheckbox>
          <CusCheckbox indeterminate>Qisman belgilangan</CusCheckbox>
          <CusCheckbox isDisabled>Disabled</CusCheckbox>
        </div>
        <CusCheckboxGroup
          label="Ruxsatlar"
          defaultValue={['read']}
          options={[
            { label: "O'qish", value: 'read' },
            { label: 'Yozish', value: 'write' },
            { label: "O'chirish", value: 'delete' },
          ]}
        />
        <CusRadioGroup
          direction="column"
          defaultValue="monthly"
          options={[
            { label: 'Oylik', value: 'monthly' },
            { label: 'Yillik', value: 'yearly' },
            { label: 'Bir martalik', value: 'once', isDisabled: true },
          ]}
        />
        <div className="flex flex-col gap-3">
          <CusSwitch checked={notify} onChange={setNotify}>
            Bildirishnomalar
          </CusSwitch>
          <CusSwitch size="sm">Kichik</CusSwitch>
          <CusSwitch size="lg" defaultChecked>
            Katta
          </CusSwitch>
        </div>
      </DevRow>

      <DevRow title="Slider / Rating" className="grid items-start gap-8 md:grid-cols-3">
        <CusSlider label="Volume" defaultValue={[40]} />
        <CusSlider label="Price range" value={price} onChange={setPrice} formatValue={(v) => `$${v}`} />
        <div className="flex flex-col gap-2">
          <CusRating defaultValue={4} />
          <CusRating defaultValue={3.5} allowHalf size="sm" isReadOnly />
        </div>
      </DevRow>

      <DevRow title="FileUpload" className="block">
        <CusFileUpload maxFiles={3} accept={['image/*', '.pdf']} />
      </DevRow>
    </CusCard>
  )
}
