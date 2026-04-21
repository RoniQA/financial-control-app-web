import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  companyId: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  initializeDefault: () => void
}

const DEFAULT_USER: User = {
  id: 'user_local_admin',
  email: 'admin@gestus.local',
  firstName: 'Admin',
  lastName: 'Local',
  companyId: 'company_local',
}

const storageKey = 'auth-storage-v1'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        const state = {
          user,
          isAuthenticated: true,
        }
        localStorage.setItem(storageKey, JSON.stringify({
          state,
          version: 0
        }))
        set(state)
      },
      logout: () => {
        localStorage.removeItem(storageKey)
        set({
          user: null,
          isAuthenticated: false,
        })
      },
      initializeDefault: () => {
        const savedAuth = localStorage.getItem(storageKey)
        if (savedAuth) {
          try {
            const { state } = JSON.parse(savedAuth)
            set(state)
            return
          } catch (error) {
            // Ignore parse errors
          }
        }
        // Fall back to default user
        set({
          user: DEFAULT_USER,
          isAuthenticated: true,
        })
      },
    }),
    {
      name: storageKey,
      skipHydration: true,
    }
  )
)

