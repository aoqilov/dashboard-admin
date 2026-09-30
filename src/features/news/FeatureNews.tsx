import { Newspaper, Plus } from 'lucide-react'
import { CusCard } from '@/components/shared/card/CusCard'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusButton } from '@/components/ui/buttons/CusButton'
import { CusEmptyState } from '@/components/ui/empty-state/CusEmptyState'

export default function FeatureNews() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="News"
        description="Yangiliklar va maqolalar"
        actions={<CusButton leftIcon={<Plus />}>Yangilik qo'shish</CusButton>}
      />
      <CusCard>
        <CusEmptyState
          icon={<Newspaper />}
          title="Yangiliklar yo'q"
          description="Hozircha hech narsa qo'shilmagan"
        />
      </CusCard>
    </div>
  )
}
