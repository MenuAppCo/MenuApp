import api from './api'

export const restaurantService = {
  // Get restaurant info
  async getRestaurant() {
    const response = await api.get('/restaurants/me')
    return response.data
  },

  // Update restaurant info
  async updateRestaurant(restaurantData) {
    const response = await api.put('/restaurants/me', restaurantData)
    return response.data
  },

  // Upload restaurant logo
  async uploadLogo(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post('/uploads/restaurant/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete restaurant logo
  async deleteLogo() {
    const response = await api.delete('/uploads/restaurant/logo')
    return response.data
  },

  // Get restaurant settings
  async getSettings() {
    const response = await api.get('/restaurants/me/settings')
    return response.data.data // Devolver solo los settings, no toda la respuesta
  },

  // Update restaurant settings
  async updateSettings(settingsData) {
    const response = await api.put('/restaurants/me/settings', settingsData)
    return response.data.data // Devolver solo los settings, no toda la respuesta
  },

  // Get restaurant social media
  async getSocialMedia() {
    const response = await api.get('/restaurants/me/social-media')
    return response.data.data
  },

  // Update restaurant social media
  async updateSocialMedia(socialMediaData) {
    const response = await api.put('/restaurants/me/social-media', socialMediaData)
    return response.data.data
  }
} 