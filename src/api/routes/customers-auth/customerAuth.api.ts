import api from '../../api-config/axiosInstance'
import type { BuyerMe, BuyerUpdateRequest, LoginRequest, RefreshRequest, TokenPair } from './customerAuth.types'

/** Xaridor autentifikatsiyasi va profili */
export const customerAuth = {
  async login(body: LoginRequest) {
    const { data } = await api.post<TokenPair>('/customers/login', body)
    return data
  },

  async me() {
    const { data } = await api.get<BuyerMe>('/customers/me')
    return data
  },

  async updateMe(body: BuyerUpdateRequest | FormData) {
    const { data } = await api.patch<BuyerMe>('/customers/me', body)
    return data
  },

  async refresh(body: RefreshRequest) {
    const { data } = await api.post<TokenPair>('/customers/refresh', body)
    return data
  },
}
