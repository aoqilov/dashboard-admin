import api from '../../api-config/axiosInstance'
import type { PageRequest, Paginated } from '../../common.types'
import type { FavoriteProduct, Store } from './customerFavorites.types'

/** Xaridorning saqlangan mahsulot va do'konlari */
export const customerFavorites = {
  async getProducts(body: PageRequest = {}) {
    const { data } = await api.post<Paginated<FavoriteProduct>>('/customers/favorites/products/get-all', body)
    return data
  },

  async addProduct(productId: number) {
    await api.post(`/customers/favorites/products/${productId}`)
  },

  async removeProduct(productId: number) {
    await api.delete(`/customers/favorites/products/${productId}`)
  },

  async getStores(body: PageRequest = {}) {
    const { data } = await api.post<Paginated<Store>>('/customers/favorites/stores/get-all', body)
    return data
  },

  async addStore(storeId: number) {
    await api.post(`/customers/favorites/stores/${storeId}`)
  },

  async removeStore(storeId: number) {
    await api.delete(`/customers/favorites/stores/${storeId}`)
  },
}
