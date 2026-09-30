import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type {
  StoreProductVariant,
  StoreProductVariantRequest,
  StoreProductVariantUpdateRequest,
} from './storeProductVariants.types'

export const storeProductVariants = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreProductVariant>>('/stores/product-variants/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreProductVariant>(`/stores/product-variants/${id}/`)
    return data
  },

  async create(body: StoreProductVariantRequest) {
    const { data } = await api.post<StoreProductVariant>('/stores/product-variants/', body)
    return data
  },

  async update(id: number, body: StoreProductVariantUpdateRequest) {
    const { data } = await api.patch<StoreProductVariant>(`/stores/product-variants/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/product-variants/${id}/`)
  },
}
