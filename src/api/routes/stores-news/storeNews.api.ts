import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreNews, StoreNewsRequest, StoreNewsUpdateRequest } from './storeNews.types'

export const storeNews = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreNews>>('/stores/news/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreNews>(`/stores/news/${id}/`)
    return data
  },

  async create(body: StoreNewsRequest) {
    const { data } = await api.post<StoreNews>('/stores/news/', body)
    return data
  },

  async update(id: number, body: StoreNewsUpdateRequest) {
    const { data } = await api.patch<StoreNews>(`/stores/news/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/news/${id}/`)
  },
}
