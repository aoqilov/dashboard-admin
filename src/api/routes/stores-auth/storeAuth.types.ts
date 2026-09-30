import type { Store } from '../stores-store/store.types'

export type { LoginRequest, RefreshRequest, TokenPair } from '../../common.types'

/** Kirgan do'kon admini */
export interface StoreAdminMe {
  id: number
  login: string
  active?: boolean
  store: Store
  created_at: string
  updated_at: string
}
