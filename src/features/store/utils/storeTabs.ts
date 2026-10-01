import type { Platform } from '@/api/routes/stores-social-links/storeSocialLinks.types'

export type StoreTab =
  | 'info'
  | 'addresses'
  | 'contacts'
  | 'services'
  | 'social'
  | 'colors'
  | 'tags'
  | 'materials'
  | 'material-groups'

/** Magazin sahifasi tablari — bir qatorda, shu tartibda */
export const STORE_TABS: { value: StoreTab; label: string }[] = [
  { value: 'info', label: "Do'kon" },
  { value: 'addresses', label: 'Manzillar' },
  { value: 'contacts', label: 'Kontaktlar' },
  { value: 'services', label: 'Xizmatlar' },
  { value: 'social', label: 'Ijtimoiy tarmoqlar' },
  { value: 'colors', label: 'Ranglar' },
  { value: 'tags', label: 'Teglar' },
  { value: 'materials', label: 'Materiallar' },
  { value: 'material-groups', label: 'Material guruhlari' },
]

/** Ijtimoiy tarmoqlar: nomi va havola namunasi */
export const PLATFORMS: Record<Platform, { label: string; placeholder: string }> = {
  instagram: { label: 'Instagram', placeholder: 'https://instagram.com/username' },
  telegram: { label: 'Telegram', placeholder: 'https://t.me/username' },
  whatsapp: { label: 'WhatsApp', placeholder: 'https://wa.me/998901234567' },
  vk: { label: 'VK', placeholder: 'https://vk.com/username' },
  tiktok: { label: 'TikTok', placeholder: 'https://tiktok.com/@username' },
  youtube: { label: 'YouTube', placeholder: 'https://youtube.com/@channel' },
  facebook: { label: 'Facebook', placeholder: 'https://facebook.com/page' },
  other: { label: 'Boshqa', placeholder: 'https://' },
}
