import api from '../../api-config/axiosInstance'
import type { Paginated } from '../../common.types'
import type {
  CategoryReportItem,
  ProductFavoriteReportItem,
  ProductViewReportItem,
  ReportPeriodRequest,
  StoreReportSummary,
} from './storeReports.types'

export const storeReports = {
  async summary() {
    const { data } = await api.get<StoreReportSummary>('/stores/reports/summary')
    return data
  },

  async mostViewedProducts(body: ReportPeriodRequest = {}) {
    const { data } = await api.post<Paginated<ProductViewReportItem>>('/stores/reports/most-viewed-products', body)
    return data
  },

  async mostFavoritedProducts(body: ReportPeriodRequest = {}) {
    const { data } = await api.post<Paginated<ProductFavoriteReportItem>>(
      '/stores/reports/most-favorited-products',
      body,
    )
    return data
  },

  async mostPopularCategories(body: ReportPeriodRequest = {}) {
    const { data } = await api.post<Paginated<CategoryReportItem>>('/stores/reports/most-popular-categories', body)
    return data
  },
}
