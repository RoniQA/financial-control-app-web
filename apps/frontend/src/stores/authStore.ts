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
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) => {
        console.log('🔐 Login called with:', { user, hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },
      logout: () => {
        console.log('🔓 Logout called');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      updateTokens: (accessToken, refreshToken) => {
        console.log('🔄 Update tokens called:', { hasAccessToken: !!accessToken, hasRefreshToken: !!refreshToken });
        set({ accessToken, refreshToken });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          console.log('🔍 Getting from storage:', name, str ? JSON.parse(str) : null);
          return str;
        },
        setItem: (name, value) => {
          console.log('💾 Setting in storage:', name, value);
          localStorage.setItem(name, value);
        },
        removeItem: (name) => {
          console.log('🗑️ Removing from storage:', name);
          localStorage.removeItem(name);
        },
      },
    }
  )
)

