import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/api/v1/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api 