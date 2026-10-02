import type { CancellationReason, PriceType } from '../stores-orders/storeOrders.types'

export type { StoreOrder } from '../stores-orders/storeOrders.types'

export interface OrderItemCreateRequest {
  product: number
  size?: number | null
  quantity: number
  price_type: PriceType
}

export interface CustomerOrderCreateRequest {
  store: number
  items: OrderItemCreateRequest[]
}

/** Xaridor buyurtmani bekor qiladi */
export interface CustomerOrderCancelRequest {
  cancellation_reason?: CancellationReason | '' | null
}
