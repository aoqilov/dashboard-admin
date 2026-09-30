import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreSocialLink, StoreSocialLinkRequest, StoreSocialLinkUpdateRequest } from './storeSocialLinks.types'

export const storeSocialLinks = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreSocialLink>>('/stores/social-links/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreSocialLink>(`/stores/social-links/${id}/`)
    return data
  },

  async create(body: StoreSocialLinkRequest) {
    const { data } = await api.post<StoreSocialLink>('/stores/social-links/', body)
    return data
  },

  async update(id: number, body: StoreSocialLinkUpdateRequest) {
    const { data } = await api.patch<StoreSocialLink>(`/stores/social-links/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/social-links/${id}/`)
  },
}
