import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type {
  StoreProductPhoto,
  StoreProductPhotoRequest,
  StoreProductPhotoUpdateRequest,
} from './storeProductPhotos.types'

export const storeProductPhotos = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreProductPhoto>>('/stores/product-photos/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreProductPhoto>(`/stores/product-photos/${id}/`)
    return data
  },

  async create(body: StoreProductPhotoRequest | FormData) {
    const { data } = await api.post<StoreProductPhoto>('/stores/product-photos/', body)
    return data
  },

  async update(id: number, body: StoreProductPhotoUpdateRequest | FormData) {
    const { data } = await api.patch<StoreProductPhoto>(`/stores/product-photos/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/product-photos/${id}/`)
  },

  /** Asl faylni yuklab olish */
  async download(id: number) {
    const { data } = await api.get<Blob>(`/stores/product-photos/${id}/download/`, { responseType: 'blob' })
    return data
  },
}
