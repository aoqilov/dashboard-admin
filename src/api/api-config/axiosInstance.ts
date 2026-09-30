import axios from 'axios'

/** .env dagi manzil, oxiridagi "/" olib tashlanadi: https://birid.silently.watch */
export const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '')

/**
 * Barcha so'rovlar shu instance orqali ketadi.
 * Route'larda yo'l /api/v1 siz yoziladi: api.get('/stores/products/1/')
 *
 * Content-Type berilmaydi: axios obyekt uchun JSON, FormData uchun
 * multipart (boundary bilan) ni o'zi qo'yadi.
 */
const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30_000,
  paramsSerializer: { indexes: null },
})

export default api
