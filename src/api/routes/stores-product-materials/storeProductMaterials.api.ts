import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type {
  StoreProductMaterial,
  StoreProductMaterialRequest,
  StoreProductMaterialUpdateRequest,
} from './storeProductMaterials.types'

export const storeProductMaterials = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreProductMaterial>>('/stores/product-materials/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreProductMaterial>(`/stores/product-materials/${id}/`)
    return data
  },

  async create(body: StoreProductMaterialRequest) {
    const { data } = await api.post<StoreProductMaterial>('/stores/product-materials/', body)
    return data
  },

  async update(id: number, body: StoreProductMaterialUpdateRequest) {
    const { data } = await api.patch<StoreProductMaterial>(`/stores/product-materials/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/product-materials/${id}/`)
  },
}
