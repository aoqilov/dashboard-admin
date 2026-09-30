import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { PublicProduct } from './publicProducts.types'

/** Sayt uchun ochiq mahsulotlar (token shart emas) */
export const publicProducts = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<PublicProduct>>('/public/products/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<PublicProduct>(`/public/products/${id}/`)
    return data
  },
}
