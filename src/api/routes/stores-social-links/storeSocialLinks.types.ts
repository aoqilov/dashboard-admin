export type Platform = 'instagram' | 'telegram' | 'whatsapp' | 'vk' | 'tiktok' | 'youtube' | 'facebook' | 'other'

export interface StoreSocialLink {
  id: number
  platform: Platform
  nickname?: string
  url: string
  visible?: boolean
  created_at: string
  updated_at: string
}

export interface StoreSocialLinkRequest {
  platform: Platform
  nickname?: string
  url: string
  visible?: boolean
}

export type StoreSocialLinkUpdateRequest = Partial<StoreSocialLinkRequest>
