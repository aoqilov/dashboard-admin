import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreService, StoreServiceRequest, StoreServiceUpdateRequest } from './storeServices.types'

export const storeServices = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreService>>('/stores/services/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreService>(`/stores/services/${id}/`)
    return data
  },

  async create(body: StoreServiceRequest) {
    const { data } = await api.post<StoreService>('/stores/services/', body)
    return data
  },

  async update(id: number, body: StoreServiceUpdateRequest) {
    const { data } = await api.patch<StoreService>(`/stores/services/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/services/${id}/`)
  },
}
