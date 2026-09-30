import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { PublicStore, PublicStoreDetail } from './publicStores.types'

/** Sayt uchun ochiq do'konlar (token shart emas) */
export const publicStores = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<PublicStore>>('/public/stores/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<PublicStoreDetail>(`/public/stores/${id}/`)
    return data
  },
}
