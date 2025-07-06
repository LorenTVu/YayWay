import { apiClient } from './client'
import { User } from '@/types/user'

export interface LoginResponse {
  user: User
  token: string
  message: string
}

export interface RegisterResponse {
  user: User
  token: string
  message: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  displayName: string
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },

  async register(userData: RegisterData): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get('/auth/me')
    return response.data.user
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/refresh')
    return response.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  }
} 