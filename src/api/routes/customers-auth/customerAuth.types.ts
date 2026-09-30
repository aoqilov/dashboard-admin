import type { PhotoProcessingStatus } from '../../common.types'

export type { LoginRequest, RefreshRequest, TokenPair } from '../../common.types'

export type Gender = 'male' | 'female'

/** Kirgan xaridor */
export interface BuyerMe {
  id: number
  login: string
  active?: boolean
  last_name: string
  first_name: string
  middle_name?: string
  age?: number | null
  gender?: Gender | '' | null
  city?: string
  avatar_photo?: string | null
  avatar_photo_processed: string | null
  avatar_processing_status?: PhotoProcessingStatus | '' | null
  created_at: string
  updated_at: string
}

/** Avatar yuborilsa — FormData */
export interface BuyerUpdateRequest {
  last_name?: string
  first_name?: string
  middle_name?: string
  age?: number | null
  gender?: Gender | '' | null
  city?: string
  avatar_photo?: File | Blob | null
}
