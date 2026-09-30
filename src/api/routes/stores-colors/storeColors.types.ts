export interface StoreColor {
  id: number
  name: string
  /** "#ffffff" */
  hex_code: string
  created_at: string
  updated_at: string
}

export interface StoreColorRequest {
  name: string
  hex_code: string
}

export type StoreColorUpdateRequest = Partial<StoreColorRequest>
