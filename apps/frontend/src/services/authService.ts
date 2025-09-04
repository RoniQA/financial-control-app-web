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
    console.log('🔐 Calling login API with:', { email: data.email });
    const response = await api.post('/auth/login', data);
    console.log('🔐 Login API response:', {
      status: response.status,
      hasData: !!response.data,
      hasUser: !!response.data?.user,
      hasToken: !!response.data?.accessToken
    });
    
    // Validar a resposta
    if (!response.data?.user || !response.data?.accessToken) {
      throw new Error('Resposta da API incompleta');
    }
    
    return response.data;
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

