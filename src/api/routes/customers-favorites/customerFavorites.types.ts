export type { Store } from '../stores-store/store.types'

export interface FavoriteProduct {
  id: number
  store: number
  name: string
  slug: string
  category: number
  price_sale?: string | null
  price_rental?: string | null
  is_sellable?: boolean
  is_rentable?: boolean
}
