import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreDiscount, StoreDiscountRequest, StoreDiscountUpdateRequest } from './storeDiscounts.types'

export const storeDiscounts = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreDiscount>>('/stores/discounts/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreDiscount>(`/stores/discounts/${id}/`)
    return data
  },

  async create(body: StoreDiscountRequest) {
    const { data } = await api.post<StoreDiscount>('/stores/discounts/', body)
    return data
  },

  async update(id: number, body: StoreDiscountUpdateRequest) {
    const { data } = await api.patch<StoreDiscount>(`/stores/discounts/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/discounts/${id}/`)
  },
}
