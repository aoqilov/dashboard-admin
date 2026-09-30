import { Package, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'

export default function FeatureProducts() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Products"
        description="Mahsulotlar ro'yxati"
        actions={<CusButton leftIcon={<Plus />}>Mahsulot qo'shish</CusButton>}
      />
      <CusCard>
        <CusEmptyState
          icon={<Package />}
          title="Mahsulotlar yo'q"
          description="Hozircha hech narsa qo'shilmagan"
        />
      </CusCard>
    </div>
  )
}
