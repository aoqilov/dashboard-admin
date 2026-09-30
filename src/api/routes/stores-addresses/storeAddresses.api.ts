import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreAddress, StoreAddressRequest, StoreAddressUpdateRequest } from './storeAddresses.types'

export const storeAddresses = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreAddress>>('/stores/addresses/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreAddress>(`/stores/addresses/${id}/`)
    return data
  },

  async create(body: StoreAddressRequest) {
    const { data } = await api.post<StoreAddress>('/stores/addresses/', body)
    return data
  },

  async update(id: number, body: StoreAddressUpdateRequest) {
    const { data } = await api.patch<StoreAddress>(`/stores/addresses/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/addresses/${id}/`)
  },
}
