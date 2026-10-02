import type { NewsType } from '@/api/routes/stores-news/storeNews.types'
import type { ColorVariant } from '@/theme/tokens'

/** Yangilik turlari: nomi va belgi rangi */
export const NEWS_TYPES: { value: NewsType; label: string; color: ColorVariant }[] = [
  { value: 'event', label: 'Tadbir', color: 'primary' },
  { value: 'discount', label: 'Chegirma', color: 'danger' },
  { value: 'holiday', label: 'Bayram', color: 'success' },
  { value: 'other', label: 'Boshqa', color: 'dark' },
]

export const newsType = (value: NewsType) => NEWS_TYPES.find((item) => item.value === value) ?? NEWS_TYPES[3]
