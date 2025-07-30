import api from './api'

export const authService = {
  // Login
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  // Register
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Get current user
  async getCurrentUser() {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Update profile
  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData)
    return response.data
  },

  // Change password
  async changePassword(passwords) {
    const response = await api.put('/auth/password', passwords)
    return response.data
  }
} 