/** Material guruhi (Mato, Bezak ...) */
export interface StoreProductMaterialCategory {
  id: number
  name: string
  created_at: string
  updated_at: string
}

export interface StoreProductMaterialCategoryRequest {
  name: string
}

export type StoreProductMaterialCategoryUpdateRequest = Partial<StoreProductMaterialCategoryRequest>
