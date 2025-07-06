import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && originalRequest) {
          // Try to refresh token
          try {
            const token = localStorage.getItem('token')
            if (token) {
              const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
                headers: { Authorization: `Bearer ${token}` }
              })
              
              const newToken = response.data.token
              localStorage.setItem('token', newToken)
              
              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  // Generic HTTP methods
  async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  async post<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  async put<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  async patch<T = any>(url: string, data?: any, config?: any): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }
}

export const apiClient = new ApiClient() 