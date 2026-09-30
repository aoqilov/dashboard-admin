import api from '../../api-config/axiosInstance'
import type { LoginRequest, RefreshRequest, StoreAdminMe, TokenPair } from './storeAuth.types'

/** Do'kon admini autentifikatsiyasi */
export const storeAuth = {
  async login(body: LoginRequest) {
    const { data } = await api.post<TokenPair>('/stores/login', body)
    return data
  },

  async me() {
    const { data } = await api.get<StoreAdminMe>('/stores/me')
    return data
  },

  async refresh(body: RefreshRequest) {
    const { data } = await api.post<TokenPair>('/stores/refresh', body)
    return data
  },
}
