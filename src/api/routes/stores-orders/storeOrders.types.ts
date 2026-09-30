export type PriceType = 'sale' | 'rental' | 'tailoring'

export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'delivered'
  | 'closed'
  | 'cancelled'
  | 'returned'

export type CancellationReason =
  | 'changed_mind'
  | 'found_better_price'
  | 'ordered_by_mistake'
  | 'delivery_too_slow'
  | 'out_of_stock'
  | 'cannot_fulfill'
  | 'buyer_unreachable'
  | 'suspected_fraud'
  | 'other'

export type CancelledBy = 'buyer' | 'store'

export interface StoreOrderItem {
  id: number
  product?: number | null
  /** Buyurtma paytidagi mahsulot nusxasi */
  product_snapshot: unknown
  quantity: number
  price_type: PriceType
  base_price: string
  final_price: string
  applied_discount?: unknown
  created_at: string
  updated_at: string
}

export interface StoreOrder {
  id: number
  store: number
  buyer: number
  status?: OrderStatus
  cancelled_by?: CancelledBy | '' | null
  cancellation_reason?: CancellationReason | '' | null
  items: StoreOrderItem[]
  created_at: string
  updated_at: string
}

/** Do'kon buyurtma holatini o'zgartiradi */
export interface StoreOrderStatusUpdateRequest {
  status?: OrderStatus
  cancellation_reason?: CancellationReason | '' | null
}
