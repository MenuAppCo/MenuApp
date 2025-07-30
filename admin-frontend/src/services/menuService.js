import api from './api'

export const menuService = {
  // Obtener todos los menús del restaurante
  async getMenus() {
    const response = await api.get('/menus')
    console.log('🔍 MenuService getMenus response:', response.data)
    return response.data
  },

  // Obtener un menú específico
  async getMenu(menuId) {
    const response = await api.get(`/menus/${menuId}`)
    return response.data
  },

  // Crear un nuevo menú
  async createMenu(menuData) {
    const response = await api.post('/menus', menuData)
    return response.data
  },

  // Actualizar un menú
  async updateMenu(menuId, menuData) {
    const response = await api.put(`/menus/${menuId}`, menuData)
    return response.data
  },

  // Eliminar un menú
  async deleteMenu(menuId) {
    const response = await api.delete(`/menus/${menuId}`)
    return response.data
  },

  // Reordenar menús
  async reorderMenus(data) {
    const response = await api.put('/menus/reorder', data)
    return response.data
  }
} 