import { Layers, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'

export default function FeatureCategories() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Categories"
        description="Mahsulot kategoriyalari"
        actions={<CusButton leftIcon={<Plus />}>Kategoriya qo'shish</CusButton>}
      />
      <CusCard>
        <CusEmptyState
          icon={<Layers />}
          title="Kategoriyalar yo'q"
          description="Hozircha hech narsa qo'shilmagan"
        />
      </CusCard>
    </div>
  )
}
