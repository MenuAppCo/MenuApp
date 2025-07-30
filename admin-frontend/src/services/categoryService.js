import api from './api'

export const categoryService = {
  // Get all categories
  async getCategories(params = {}) {
    const response = await api.get('/categories', { params })
    return response.data
  },

  // Get single category
  async getCategory(id) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  // Create category
  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData)
    return response.data
  },

  // Update category
  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },

  // Delete category
  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },

  // Upload category image
  async uploadImage(categoryId, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post(`/uploads/categories/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete category image
  async deleteImage(categoryId) {
    const response = await api.delete(`/uploads/categories/${categoryId}`)
    return response.data
  }
} 