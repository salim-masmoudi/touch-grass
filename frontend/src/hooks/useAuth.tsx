import React, { createContext, useContext, useEffect, useState } from 'react'
import { setToken, getToken, clearToken } from '../utils/auth'

interface AuthContextData {
  isAuthenticated: boolean
  signing: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  signing: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    const token = getToken()
    setIsAuthenticated(!!token)
  }, [])

  async function signIn(email: string, password: string) {
    setSigning(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/login/access-token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ username: email, password }).toString(),
        }
      )
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      setToken(data.access_token)
      setIsAuthenticated(true)
    } finally {
      setSigning(false)
    }
  }

  async function signUp(email: string, password: string) {
    setSigning(true)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      )
      if (!res.ok) throw new Error('Registration failed')
    } finally {
      setSigning(false)
    }
  }

  function signOut() {
    clearToken()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signing, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
