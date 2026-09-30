import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreOrder, StoreOrderStatusUpdateRequest } from './storeOrders.types'

/** Do'konga kelgan buyurtmalar (yaratish/o'chirish yo'q) */
export const storeOrders = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreOrder>>('/stores/orders/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreOrder>(`/stores/orders/${id}/`)
    return data
  },

  async updateStatus(id: number, body: StoreOrderStatusUpdateRequest) {
    const { data } = await api.patch<StoreOrder>(`/stores/orders/${id}/`, body)
    return data
  },
}
