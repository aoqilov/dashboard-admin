import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreColor, StoreColorRequest, StoreColorUpdateRequest } from './storeColors.types'

export const storeColors = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreColor>>('/stores/colors/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreColor>(`/stores/colors/${id}/`)
    return data
  },

  async create(body: StoreColorRequest) {
    const { data } = await api.post<StoreColor>('/stores/colors/', body)
    return data
  },

  async update(id: number, body: StoreColorUpdateRequest) {
    const { data } = await api.patch<StoreColor>(`/stores/colors/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/colors/${id}/`)
  },
}
