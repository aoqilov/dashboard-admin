import { Store, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'

export default function FeatureStore() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Магазин"
        description="Do'kon ma'lumotlari va filiallar"
        actions={<CusButton leftIcon={<Plus />}>Do'kon qo'shish</CusButton>}
      />
      <CusCard>
        <CusEmptyState
          icon={<Store />}
          title="Do'konlar yo'q"
          description="Hozircha hech narsa qo'shilmagan"
        />
      </CusCard>
    </div>
  )
}
