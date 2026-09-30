import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSwitch } from '@/components/ui/inputs/CusSwitch'
import { CusSelect } from '@/components/ui/select/CusSelect'

const LANGUAGES = [
  { label: "O'zbekcha", value: 'uz' },
  { label: 'Русский', value: 'ru' },
  { label: 'English', value: 'en' },
]

const CURRENCIES = [
  { label: "So'm (UZS)", value: 'uzs' },
  { label: 'Dollar (USD)', value: 'usd' },
]

export default function FeatureSettings() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Do'kon va tizim sozlamalari"
        actions={<CusButton>Saqlash</CusButton>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <CusCard>
          <CusCardHeader title="Umumiy" />
          <div className="flex flex-col gap-5">
            <CusInput label="Do'kon nomi" defaultValue="Master Admin" />
            <CusInput label="Aloqa telefoni" placeholder="+998 90 123 45 67" />
            <CusSelect label="Til" options={LANGUAGES} defaultValue={['uz']} />
            <CusSelect label="Valyuta" options={CURRENCIES} defaultValue={['uzs']} />
          </div>
        </CusCard>

        <CusCard>
          <CusCardHeader title="Bildirishnomalar" />
          <div className="flex flex-col gap-4">
            <CusSwitch defaultChecked>Yangi buyurtma haqida xabar</CusSwitch>
            <CusSwitch defaultChecked>Mahsulot tugab qolganda xabar</CusSwitch>
            <CusSwitch>Haftalik hisobot emailga</CusSwitch>
          </div>
        </CusCard>
      </div>
    </div>
  )
}
