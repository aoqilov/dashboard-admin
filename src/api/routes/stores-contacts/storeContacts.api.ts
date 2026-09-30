import api from '../../api-config/axiosInstance'
import type { GetAllRequest, Paginated } from '../../common.types'
import type { StoreContact, StoreContactRequest, StoreContactUpdateRequest } from './storeContacts.types'

export const storeContacts = {
  async getAll(body: GetAllRequest = {}) {
    const { data } = await api.post<Paginated<StoreContact>>('/stores/contacts/get-all/', body)
    return data
  },

  async getOne(id: number) {
    const { data } = await api.get<StoreContact>(`/stores/contacts/${id}/`)
    return data
  },

  async create(body: StoreContactRequest) {
    const { data } = await api.post<StoreContact>('/stores/contacts/', body)
    return data
  },

  async update(id: number, body: StoreContactUpdateRequest) {
    const { data } = await api.patch<StoreContact>(`/stores/contacts/${id}/`, body)
    return data
  },

  async delete(id: number) {
    await api.delete(`/stores/contacts/${id}/`)
  },
}
