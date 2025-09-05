import api from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    companyId: string
  }
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('🔐 Calling login API with:', { email: data.email });
      
      // Primeiro, testar a conectividade
      const testResponse = await api.get('/auth/test');
      console.log('🔗 API Test response:', testResponse.data);
      
      // Tentar fazer login
      const response = await api.post('/auth/login', data);
      
      console.log('🔐 Login API raw response:', response);
      console.log('🔐 Login API response data:', response.data);
      console.log('🔐 Login response details:', {
        status: response.status,
        hasData: !!response.data,
        hasUser: !!response.data?.user,
        hasToken: !!response.data?.accessToken,
        responseType: typeof response.data,
        userDetails: response.data?.user ? {
          id: response.data.user.id,
          email: response.data.user.email,
          companyId: response.data.user.companyId
        } : null
      });
      
      // Validar a resposta detalhadamente
      if (!response.data) {
        throw new Error('Resposta vazia da API');
      }
      
      if (!response.data.user) {
        throw new Error('Resposta não contém dados do usuário');
      }
      
      if (!response.data.accessToken) {
        throw new Error('Resposta não contém token de acesso');
      }
      
      if (!response.data.refreshToken) {
        throw new Error('Resposta não contém refresh token');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('🔥 Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}

