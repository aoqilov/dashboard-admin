/** Do'kon xizmati (tikish, yetkazib berish ...) */
export interface StoreService {
  id: number
  /** Icon id */
  icon: number
  title: string
  kicker?: string
  description?: string
  visible?: boolean
  created_at: string
  updated_at: string
}

export interface StoreServiceRequest {
  icon: number
  title: string
  kicker?: string
  description?: string
  visible?: boolean
}

export type StoreServiceUpdateRequest = Partial<StoreServiceRequest>
