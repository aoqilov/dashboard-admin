export interface Store {
  id: number
  name: string
  description?: string
  phone?: string
  email?: string
  active?: boolean
  created_at: string
  updated_at: string
}

export interface StoreUpdateRequest {
  name?: string
  description?: string
  phone?: string
  email?: string
}
