import axios from 'axios'

// Determine API base URL based on environment
export const apiBase = (() => {
  // If VITE_API_BASE is explicitly set, use it
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }

  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8000'
  }

  // In production, use the same origin (e.g., https://yourapp.com/api)
  // If your backend is on a different domain, set VITE_API_BASE in environment
  const protocol = window.location.protocol
  const host = window.location.host
  return `${protocol}//${host}/api`
})()

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
