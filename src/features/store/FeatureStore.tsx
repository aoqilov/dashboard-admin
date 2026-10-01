import type { ComponentType } from 'react'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusTabs } from '@/components/ui/tabs/CusTabs'
import { useSearchParams } from '@/router/router'
import { AddressesTab } from './components/AddressesTab'
import { ColorsTab } from './components/ColorsTab'
import { ContactsTab } from './components/ContactsTab'
import { MaterialGroupsTab } from './components/MaterialGroupsTab'
import { MaterialsTab } from './components/MaterialsTab'
import { ServicesTab } from './components/ServicesTab'
import { SocialLinksTab } from './components/SocialLinksTab'
import { StoreInfoTab } from './components/StoreInfoTab'
import { TagsTab } from './components/TagsTab'
import { STORE_TABS, type StoreTab } from './utils/storeTabs'

const TAB_CONTENT: Record<StoreTab, ComponentType> = {
  info: StoreInfoTab,
  addresses: AddressesTab,
  contacts: ContactsTab,
  services: ServicesTab,
  social: SocialLinksTab,
  colors: ColorsTab,
  tags: TagsTab,
  materials: MaterialsTab,
  'material-groups': MaterialGroupsTab,
}

/** Magazin: do'kon ma'lumotlari, filiallar, kontaktlar va ma'lumotnomalar — har biri alohida tabda */
export default function FeatureStore() {
  const [params, setParams] = useSearchParams()
  const tab = STORE_TABS.find((item) => item.value === params.get('tab'))?.value ?? 'info'
  const Content = TAB_CONTENT[tab]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Магазин" description="Do'kon ma'lumotlari, filiallar, kontaktlar va ma'lumotnomalar" />
      <CusCard className="flex flex-col gap-5">
        <CusTabs
          scrollable
          items={STORE_TABS}
          value={tab}
          onChange={(value) => setParams({ tab: value === 'info' ? null : value })}
        />
        <Content />
      </CusCard>
    </div>
  )
}
