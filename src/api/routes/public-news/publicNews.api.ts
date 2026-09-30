import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { PublicStoreNews } from './publicNews.types'

/** Sayt uchun ochiq yangiliklar (token shart emas) */
export const publicNews = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<PublicStoreNews>>('/public/news/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<PublicStoreNews>(`/public/news/${id}/`)
    return data
  },
}
