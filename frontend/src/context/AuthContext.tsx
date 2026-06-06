import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createApiClient } from '../services/api'

export type AuthUser = {
  user_id: number
  email: string
  full_name?: string | null
  phone_number?: string | null
  role: string
}

type AuthContextValue = {
  token: string | null
  user: AuthUser | null
  loading: boolean
  setAuth: (token: string | null, user: AuthUser | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'access_token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existingToken = localStorage.getItem(TOKEN_KEY)
    if (!existingToken) {
      setLoading(false)
      return
    }

    setTokenState(existingToken)
    const apiClient = createApiClient(existingToken)
    apiClient
      .get<AuthUser>('/api/v1/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setTokenState(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const setAuth = (t: string | null, u: AuthUser | null) => {
    setTokenState(t)
    setUser(u)
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  }

  const logout = () => setAuth(null, null)

  const value = useMemo<AuthContextValue>(() => ({ token, user, loading, setAuth, logout }), [token, user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

