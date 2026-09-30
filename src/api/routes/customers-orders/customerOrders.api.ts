import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { CustomerOrderCancelRequest, CustomerOrderCreateRequest, StoreOrder } from './customerOrders.types'

/** Xaridorning buyurtmalari */
export const customerOrders = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreOrder>>('/customers/orders/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreOrder>(`/customers/orders/${id}/`)
    return data
  },

  async create(body: CustomerOrderCreateRequest) {
    const { data } = await api.post<StoreOrder>('/customers/orders/', body)
    return data
  },

  async cancel(id: number, body: CustomerOrderCancelRequest) {
    const { data } = await api.patch<StoreOrder>(`/customers/orders/${id}/`, body)
    return data
  },
}
