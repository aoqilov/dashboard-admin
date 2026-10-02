import { useState } from 'react'

/**
 * Ruxsat etilgan qiymatlardan birini localStorage da eslab qoladi (ko'rinish/layout tanlovi uchun).
 * Saqlab bo'lmasa ham tanlov almashadi, faqat eslab qolinmaydi.
 */
export function useStoredChoice<T extends string>(key: string, allowed: readonly T[], fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return allowed.find((item) => item === stored) ?? fallback
    } catch {
      return fallback
    }
  })

  const update = (next: T) => {
    setValue(next)
    try {
      localStorage.setItem(key, next)
    } catch {
      // saqlab bo'lmasa ham ko'rinish almashadi
    }
  }

  return [value, update] as const
}
