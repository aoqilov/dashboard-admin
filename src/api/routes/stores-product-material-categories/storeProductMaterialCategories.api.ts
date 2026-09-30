import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type {
  StoreProductMaterialCategory,
  StoreProductMaterialCategoryRequest,
  StoreProductMaterialCategoryUpdateRequest,
} from './storeProductMaterialCategories.types'

export const storeProductMaterialCategories = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreProductMaterialCategory>>(
      '/stores/product-material-categories/get-all/',
      body,
    )
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreProductMaterialCategory>(`/stores/product-material-categories/${id}/`)
    return data
  },

  async create(body: StoreProductMaterialCategoryRequest) {
    const { data } = await api.post<StoreProductMaterialCategory>('/stores/product-material-categories/', body)
    return data
  },

  async update(id: number, body: StoreProductMaterialCategoryUpdateRequest) {
    const { data } = await api.patch<StoreProductMaterialCategory>(
      `/stores/product-material-categories/${id}/`,
      body,
    )
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/product-material-categories/${id}/`)
  },
}
