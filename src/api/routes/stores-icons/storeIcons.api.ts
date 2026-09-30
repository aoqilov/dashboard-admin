import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { Icon, IconRequest, IconUpdateRequest } from './storeIcons.types'

export const storeIcons = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<Icon>>('/stores/icons/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<Icon>(`/stores/icons/${id}/`)
    return data
  },

  async create(body: IconRequest) {
    const { data } = await api.post<Icon>('/stores/icons/', body)
    return data
  },

  async update(id: number, body: IconUpdateRequest) {
    const { data } = await api.patch<Icon>(`/stores/icons/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/icons/${id}/`)
  },
}
