import type { StoreAddress } from '../stores-addresses/storeAddresses.types'
import type { StoreContact } from '../stores-contacts/storeContacts.types'
import type { StoreService } from '../stores-services/storeServices.types'
import type { StoreSocialLink } from '../stores-social-links/storeSocialLinks.types'

export interface PublicStore {
  id: number
  name: string
  description?: string
  phone?: string
  email?: string
  social_links: StoreSocialLink[]
  addresses: StoreAddress[]
  contacts: StoreContact[]
  services: StoreService[]
  created_at: string
  updated_at: string
}

/** Bitta do'kon sahifasi — statistikasi bilan */
export interface PublicStoreDetail extends PublicStore {
  total_products: number
  total_categories: number
  total_subcategories: number
}
