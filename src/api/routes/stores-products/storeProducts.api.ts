import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreProduct, StoreProductRequest, StoreProductUpdateRequest } from './storeProducts.types'

export const storeProducts = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreProduct>>('/stores/products/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreProduct>(`/stores/products/${id}/`)
    return data
  },

  async create(body: StoreProductRequest) {
    const { data } = await api.post<StoreProduct>('/stores/products/', body)
    return data
  },

  async update(id: number, body: StoreProductUpdateRequest) {
    const { data } = await api.patch<StoreProduct>(`/stores/products/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/products/${id}/`)
  },
}
