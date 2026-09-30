export interface StoreProductMaterial {
  id: number
  name: string
  /** StoreProductMaterialCategory id */
  category?: number | null
  created_at: string
  updated_at: string
}

export interface StoreProductMaterialRequest {
  name: string
  category?: number | null
}

export type StoreProductMaterialUpdateRequest = Partial<StoreProductMaterialRequest>
