import api from './api'

export const publicMenuService = {
  // Obtener menú público por slug y tipo
  async getPublicMenu(slug, menuType = 'food') {
    const response = await api.get(`/public/menu/${slug}/${menuType}`)
    return response.data
  },

  // Obtener información básica del restaurante
  async getRestaurantInfo(slug) {
    const response = await api.get(`/public/restaurant/${slug}`)
    return response.data
  },

  // Obtener menús disponibles del restaurante
  async getRestaurantMenus(slug) {
    const response = await api.get(`/public/restaurant/${slug}/menus`)
    return response.data
  }
} 