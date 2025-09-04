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

const storageKey = 'auth-storage-v1';

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

        const state = {
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        };

        // Salvar explicitamente no localStorage também
        localStorage.setItem(storageKey, JSON.stringify({
          state,
          version: 0
        }));

        set(state);
      },
      logout: () => {
        console.log('🔓 Logout called');
        localStorage.removeItem(storageKey);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      updateTokens: (accessToken, refreshToken) => {
        console.log('🔄 Updating tokens');
        const currentState = useAuthStore.getState();
        const newState = { 
          ...currentState, 
          accessToken, 
          refreshToken 
        };
        
        // Atualizar localStorage
        localStorage.setItem(storageKey, JSON.stringify({
          state: newState,
          version: 0
        }));
        
        set(newState);
      },
    }),
    {
      name: storageKey,
      skipHydration: true, // Vamos gerenciar a hidratação manualmente
    }
  )
);

// Hidratar o estado inicial do localStorage
const savedAuth = localStorage.getItem(storageKey);
if (savedAuth) {
  try {
    const { state } = JSON.parse(savedAuth);
    useAuthStore.setState(state);
  } catch (error) {
    console.error('Failed to hydrate auth state:', error);
  }
}

