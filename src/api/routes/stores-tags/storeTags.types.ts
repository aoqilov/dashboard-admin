export interface StoreTag {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface StoreTagRequest {
  name: string
}

export type StoreTagUpdateRequest = Partial<StoreTagRequest>
