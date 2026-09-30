import { Percent, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'

export default function FeatureDiscounts() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Скидки"
        description="Chegirmalar va aksiyalar"
        actions={<CusButton leftIcon={<Plus />}>Chegirma qo'shish</CusButton>}
      />
      <CusCard>
        <CusEmptyState
          icon={<Percent />}
          title="Chegirmalar yo'q"
          description="Hozircha hech narsa qo'shilmagan"
        />
      </CusCard>
    </div>
  )
}
