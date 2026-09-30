import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { navigate } from '@/utils/navigate'
import type { TokenPair } from '../common.types'
import api, { BASE_URL } from './axiosInstance'
import queryClient from './queryClient'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage'

/**
 * main.tsx da bir marta import qilinadi (side-effect):
 *   import '@/api/api-config/interceptors'
 */

const LOGIN_PATH = '/login'
/** Bu so'rovlarda 401 — "login/parol xato", tokenni yangilash kerak emas */
const AUTH_URLS = ['/stores/login', '/stores/refresh']

// ─── Request: Bearer token ────────────────────────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response: 401 -> tokenni yangilash -> so'rovni qaytarish ─────────────────

/** Bir vaqtda kelgan bir nechta 401 uchun bitta refresh so'rovi */
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) throw new Error('Refresh token yo\'q')

  // `api` emas, toza axios: interceptor'lar qayta ishlamasin
  const { data } = await axios.post<TokenPair>(`${BASE_URL}/api/v1/stores/refresh`, { refreshToken })
  saveTokens(data)
  return data.accessToken
}

function logout() {
  clearTokens()
  queryClient.clear()
  if (window.location.pathname !== LOGIN_PATH) navigate(LOGIN_PATH)
}

type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean }

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    const isAuthUrl = AUTH_URLS.some((url) => config?.url?.startsWith(url))

    if (error.response?.status !== 401 || !config || isAuthUrl || config._retried) {
      return Promise.reject(error)
    }

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const token = await refreshPromise
      config._retried = true
      config.headers.Authorization = `Bearer ${token}`
      return api(config)
    } catch {
      logout()
      return Promise.reject(error)
    }
  },
)
