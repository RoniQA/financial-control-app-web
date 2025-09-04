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
        console.log('🔐 Login called with:', { 
          userId: user?.id,
          userEmail: user?.email,
          companyId: user?.companyId,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken 
        });
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
        console.log('🔄 Updating tokens');
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
      })
    }
  )
)

