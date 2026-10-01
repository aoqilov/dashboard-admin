export type CatalogKind = 'color' | 'tag' | 'material' | 'materialCategory'

export const CATALOG_NOUN: Record<CatalogKind, string> = {
  color: 'Rang',
  tag: 'Teg',
  material: 'Material',
  materialCategory: 'Material guruhi',
}

/** Har qanday ma'lumotnoma elementi: id, name va turga xos maydonlar */
export interface CatalogItem {
  id: number
  name: string
  hex_code?: string
  category?: number | null
}
