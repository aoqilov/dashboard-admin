import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreCategory, StoreCategoryRequest, StoreCategoryUpdateRequest } from './storeCategories.types'

export const storeCategories = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreCategory>>('/stores/categories/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreCategory>(`/stores/categories/${id}/`)
    return data
  },

  async create(body: StoreCategoryRequest | FormData) {
    const { data } = await api.post<StoreCategory>('/stores/categories/', body)
    return data
  },

  async update(id: number, body: StoreCategoryUpdateRequest | FormData) {
    const { data } = await api.patch<StoreCategory>(`/stores/categories/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/categories/${id}/`)
  },
}
