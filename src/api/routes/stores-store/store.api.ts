import api from '../../api-config/axiosInstance'
import type { Store, StoreUpdateRequest } from './store.types'

/** Joriy admin do'koni */
export const store = {
  async get() {
    const { data } = await api.get<Store>('/stores/store')
    return data
  },

  async update(body: StoreUpdateRequest) {
    const { data } = await api.patch<Store>('/stores/store', body)
    return data
  },
}
