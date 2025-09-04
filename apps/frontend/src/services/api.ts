import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE_URL = isDevelopment 
  ? ((import.meta as any).env?.VITE_API_URL || 'http://localhost:3001')
  : 'https://financial-control-app-web-production.up.railway.app/api';

console.log('🌐 API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { accessToken, user } = useAuthStore.getState()
    console.log('🔒 API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!accessToken,
      hasUser: !!user,
      companyId: user?.companyId
    })

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    } else {
      console.warn('⚠️ No access token available for request')
    }
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, updateTokens } = useAuthStore.getState()
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data
          updateTokens(accessToken, newRefreshToken)

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api

