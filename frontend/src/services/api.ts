import axios from 'axios'

export const apiBase = 'http://localhost:8000'

export function createApiClient(token?: string) {
  return axios.create({
    baseURL: apiBase,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  })
}
