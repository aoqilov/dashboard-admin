/** Do'kon filiali manzili */
export interface StoreAddress {
  id: number
  name: string
  address: string
  landmark?: string
  working_hours?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface StoreAddressRequest {
  name: string
  address: string
  landmark?: string
  working_hours?: string
  phone?: string
}

export type StoreAddressUpdateRequest = Partial<StoreAddressRequest>
