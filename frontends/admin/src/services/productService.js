import api from './api'

export const productService = {
  // Get all products with pagination and filters
  async getProducts(params = {}) {
    const response = await api.get('/products', { params })
    return response.data
  },

  // Get single product
  async getProduct(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  // Create product
  async createProduct(productData) {
    const response = await api.post('/products', productData)
    return response.data
  },

  // Update product
  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product
  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Upload product image
  async uploadImage(productId, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)
    
    const response = await api.post(`/uploads/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete product image
  async deleteImage(productId) {
    const response = await api.delete(`/uploads/products/${productId}`)
    return response.data
  }
} 