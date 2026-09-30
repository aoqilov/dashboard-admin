import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Tailwind klasslarini birlashtiradi va to'qnashuvlarni hal qiladi */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
