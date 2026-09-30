import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreTag, StoreTagRequest, StoreTagUpdateRequest } from './storeTags.types'

export const storeTags = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreTag>>('/stores/tags/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreTag>(`/stores/tags/${id}/`)
    return data
  },

  async create(body: StoreTagRequest) {
    const { data } = await api.post<StoreTag>('/stores/tags/', body)
    return data
  },

  async update(id: number, body: StoreTagUpdateRequest) {
    const { data } = await api.patch<StoreTag>(`/stores/tags/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/tags/${id}/`)
  },
}
