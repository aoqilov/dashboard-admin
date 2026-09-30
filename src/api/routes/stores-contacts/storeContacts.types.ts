/** Do'kon xodimi / aloqa uchun shaxs */
export interface StoreContact {
  id: number
  name: string
  role?: string
  phone?: string
  hours?: string
  telegram?: string
  has_telegram?: boolean
  created_at: string
  updated_at: string
}

export interface StoreContactRequest {
  name: string
  role?: string
  phone?: string
  hours?: string
  telegram?: string
  has_telegram?: boolean
}

export type StoreContactUpdateRequest = Partial<StoreContactRequest>
