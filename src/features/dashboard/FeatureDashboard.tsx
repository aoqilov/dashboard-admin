import { PageGrid } from '@/components/layout/admin/PageGrid'
import { AnalyticCard } from './components/AnalyticCard'
import { BookingOverview } from './components/BookingOverview'
import { ExpensesCard } from './components/ExpensesCard'
import { SaleByLocation } from './components/SaleByLocation'
import { TotalEarning } from './components/TotalEarning'
import { TravelSalesStats } from './components/TravelSalesStats'
import { WeatherCard } from './components/WeatherCard'

/**
 * Desktop (xl) joylashuvi:
 *  [ Sales Stats 6 ][ Analytic 3 ][ Expenses 3 ]
 *  [ Booking 5 ][ Weather+Earning 3 ][ Location 4 ]
 */
export default function FeatureDashboard() {
  return (
    <PageGrid>
      <div className="col-span-12 xl:col-span-6">
        <TravelSalesStats />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <AnalyticCard />
      </div>
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <ExpensesCard />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <BookingOverview />
      </div>
      <div className="col-span-12 flex flex-col gap-4 md:col-span-5 md:gap-6 xl:col-span-3">
        <WeatherCard />
        <TotalEarning />
      </div>
      <div className="col-span-12 md:col-span-7 xl:col-span-4">
        <SaleByLocation />
      </div>
    </PageGrid>
  )
}
