/** Hisobot davri. Sanalar: "2026-09-01" */
export interface ReportPeriodRequest {
  page?: number
  pageSize?: number
  from_date?: string
  to_date?: string
}

/** Dashboard umumiy raqamlari */
export interface StoreReportSummary {
  total_products: number
  total_categories: number
  total_viewed_products: number
}

export interface ProductViewReportItem {
  id: number
  name: string
  slug: string
  category: number
  price_sale?: string | null
  price_rental?: string | null
  view_count: number
}

export interface ProductFavoriteReportItem {
  id: number
  name: string
  slug: string
  category: number
  price_sale?: string | null
  price_rental?: string | null
  favorite_count: number
}

export interface CategoryReportItem {
  id: number
  name: string
  parent?: number | null
  view_count: number
}
