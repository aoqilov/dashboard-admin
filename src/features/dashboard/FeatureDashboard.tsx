import { useState } from 'react'
import { PageGrid } from '@/components/layout/admin/PageGrid'
import { PageHeader } from '@/components/shared/page-header/PageHeader'
import { CusSegment } from '@/components/ui/segment/CusSegment'
import { ActiveContentCard } from './components/ActiveContentCard'
import { AttentionCard } from './components/AttentionCard'
import { OrdersChart } from './components/OrdersChart'
import { OrderStatusCard } from './components/OrderStatusCard'
import { PopularCategoriesCard } from './components/PopularCategoriesCard'
import { StatCards } from './components/StatCards'
import { TopProductsCard } from './components/TopProductsCard'
import { PERIODS } from './utils/dashboard'

/**
 * Do'kon dashboardi (xl joylashuvi):
 *  [ 4 ta raqamli karta ]
 *  [ Buyurtmalar dinamikasi 8 ][ Buyurtmalar holati 4 ]
 *  [ Ko'p ko'rilgan 6 ][ Ko'p saqlangan 6 ]
 *  [ Mashhur kategoriyalar 4 ][ Faol chegirma/yangilik 4 ][ Diqqat talab qiladi 4 ]
 * Davr tanlagichi buyurtma va hisobotlarga ta'sir qiladi.
 */
export default function FeatureDashboard() {
  const [period, setPeriod] = useState('30')
  const days = Number(period)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Do'kon holati: buyurtmalar, mashhur mahsulotlar va e'tibor talab qiladigan joylar"
        actions={<CusSegment size="sm" value={period} onChange={setPeriod} items={PERIODS} />}
      />

      <PageGrid>
        <StatCards />

        <div className="col-span-12 xl:col-span-8">
          <OrdersChart days={days} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <OrderStatusCard days={days} />
        </div>

        <div className="col-span-12 xl:col-span-6">
          <TopProductsCard kind="viewed" days={days} />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <TopProductsCard kind="favorited" days={days} />
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <PopularCategoriesCard days={days} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4">
          <ActiveContentCard />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <AttentionCard />
        </div>
      </PageGrid>
    </div>
  )
}
