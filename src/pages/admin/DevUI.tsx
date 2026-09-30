import {
  ArrowDown,
  ArrowUp,
  Bell,
  Mail,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Users,
} from 'lucide-react'
import { CusCard, CusCardHeader } from '@/components/shared/card/CusCard'
import { CusStatItem } from '@/components/shared/stat/CusStatItem'
import { CusAvatar } from '@/components/ui/avatar/CusAvatar'
import { CusBadge } from '@/components/ui/badge/CusBadge'
import { CusIconBadge } from '@/components/ui/badge/CusIconBadge'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusIconButton } from '@/components/ui/buttons/CusIconButton'
import { CusInput } from '@/components/ui/inputs/CusInput'
import { CusSearchInput } from '@/components/ui/inputs/CusSearchInput'
import { CusLegend } from '@/components/ui/legend/CusLegend'
import { CusLabel, CusTitle, CusValue } from '@/components/ui/typography/CusTypography'
import { COLORS } from '@/config/charts'
import type { ColorVariant } from '@/theme/tokens'
import { DataSection } from './dev-ui/DataSection'
import { DevRow } from './dev-ui/DevRow'
import { FormSection } from './dev-ui/FormSection'
import { OverlaySection } from './dev-ui/OverlaySection'

const COLOR_VARIANTS: ColorVariant[] = ['primary', 'success', 'danger', 'warning', 'info', 'dark']

/** Barcha UI komponentlarining ko'rgazmasi */
export default function DevUI() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <CusTitle as="h1" size="lg">
          UI Kit
        </CusTitle>
        <CusLabel className="mt-1">src/components/ui — Tailwind va Chakra UI asosidagi barcha komponentlar</CusLabel>
      </div>

      <CusCard>
        <CusCardHeader title="Buttons" />
        <DevRow title="CusButton — variant">
          <CusButton leftIcon={<Plus />}>Primary</CusButton>
          <CusButton variant="outline">Outline</CusButton>
          <CusButton variant="ghost">Ghost</CusButton>
          <CusButton variant="danger" leftIcon={<Trash2 />}>
            Delete
          </CusButton>
        </DevRow>
        <DevRow title="CusButton — size / rounded / holat">
          <CusButton size="sm">Small</CusButton>
          <CusButton size="md">Medium</CusButton>
          <CusButton size="lg">Large</CusButton>
          <CusButton variant="outline" rounded leftIcon={<Pencil />}>
            Edit
          </CusButton>
          <CusButton isLoading>Saving</CusButton>
          <CusButton isDisabled>Disabled</CusButton>
        </DevRow>
        <DevRow title="CusIconButton">
          <CusIconButton icon={Settings} label="Settings" />
          <CusIconButton icon={Bell} label="Notifications" variant="outline" dot />
          <CusIconButton icon={Search} label="Search" variant="outline" shape="square" />
          <CusIconButton icon={Mail} label="Mail" variant="outline" size="sm" color="primary" />
          <CusIconButton icon={Trash2} label="Delete" color="danger" />
        </DevRow>
      </CusCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <CusCard>
          <CusCardHeader title="Badges" />
          <DevRow title="CusBadge — light">
            {COLOR_VARIANTS.map((color) => (
              <CusBadge key={color} color={color}>
                {color}
              </CusBadge>
            ))}
          </DevRow>
          <DevRow title="CusBadge — solid">
            {COLOR_VARIANTS.map((color) => (
              <CusBadge key={color} color={color} variant="solid">
                {color}
              </CusBadge>
            ))}
          </DevRow>
          <DevRow title="CusBadge — ikonka bilan">
            <CusBadge color="success" leftIcon={<ArrowUp />}>
              19.2%
            </CusBadge>
            <CusBadge color="danger" leftIcon={<ArrowDown />}>
              6.5%
            </CusBadge>
            <CusBadge color="primary" size="md">
              Medium
            </CusBadge>
          </DevRow>
          <DevRow title="CusIconBadge">
            <CusIconBadge icon={Users} />
            {COLOR_VARIANTS.slice(0, 5).map((color) => (
              <CusIconBadge key={color} icon={Users} color={color} />
            ))}
            <CusIconBadge icon={Users} color="primary" shape="circle" />
          </DevRow>
        </CusCard>

        <CusCard>
          <CusCardHeader title="Avatar & Typography" />
          <DevRow title="CusAvatar — size / status">
            <CusAvatar name="Sarah Parker" size="xs" />
            <CusAvatar name="Sarah Parker" size="sm" status="online" />
            <CusAvatar name="John Doe" size="md" status="busy" />
            <CusAvatar name="Musharof Chowdhury" size="lg" status="offline" />
            <CusAvatar name="Anna Lee" size="xl" status="online" />
            <CusAvatar name="Anna Lee" size="2xl" />
          </DevRow>
          <DevRow title="CusTitle / CusLabel / CusValue">
            <div className="flex flex-col gap-2">
              <CusTitle size="lg">Title lg</CusTitle>
              <CusTitle>Title md</CusTitle>
              <CusLabel>Label — ikkinchi darajali matn</CusLabel>
              <CusValue>$5024.23</CusValue>
              <CusValue size="md" color="primary">
                842
              </CusValue>
              <CusValue size="sm">Musharof</CusValue>
            </div>
          </DevRow>
          <DevRow title="CusLegend">
            <CusLegend
              items={[
                { label: 'Current year', color: 'var(--color-primary)' },
                { label: 'Last year', color: COLORS.danger },
              ]}
            />
          </DevRow>
        </CusCard>
      </div>

      <CusCard>
        <CusCardHeader title="Inputs" />
        <div className="grid gap-5 md:grid-cols-2">
          <CusInput label="First Name" placeholder="Musharof" />
          <CusInput label="Email" placeholder="info@gmail.com" leftIcon={<Mail />} hint="Ish emailingiz" />
          <CusInput label="Phone" defaultValue="+09 363 398" error="Telefon raqam noto'g'ri" />
          <CusInput label="Username" defaultValue="musharof" success hint="Bu nom bo'sh" />
          <CusInput label="Disabled" defaultValue="Read only" isDisabled />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-content">CusSearchInput</span>
            <CusSearchInput shortcut />
          </div>
        </div>
      </CusCard>

      <CusCard>
        <CusCardHeader title="Shared — CusStatItem" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <CusStatItem icon={Users} label="Customers" value="3,782" color="primary" />
          <CusStatItem icon={Users} label="Orders" value="5,359" color="success" />
          <CusStatItem icon={Users} label="Refunds" value="142" color="danger" />
          <CusStatItem icon={Users} label="Pending" value="87" color="warning" />
        </div>
      </CusCard>

      <FormSection />
      <OverlaySection />
      <DataSection />
    </div>
  )
}
