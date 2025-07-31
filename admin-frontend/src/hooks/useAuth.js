import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { authService } from '../services/authService'
import api from '../services/api'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        try {
          const response = await authService.login(email, password)
          const { restaurant, token } = response.data
          
          set({
            user: restaurant, // El backend envía 'restaurant', lo mapeamos a 'user'
            token,
            isAuthenticated: true
          })
          
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          toast.success('¡Bienvenido!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Error al iniciar sesión'
          toast.error(message)
          return { success: false, error: message }
        }
      },
      
      register: async (userData) => {
        try {
          const response = await authService.register(userData)
          const { restaurant, token } = response.data
          
          set({
            user: restaurant, // El backend envía 'restaurant', lo mapeamos a 'user'
            token,
            isAuthenticated: true
          })
          
          // Configurar token en axios
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          toast.success('¡Registro exitoso!')
          return { success: true }
        } catch (error) {
          const message = error.response?.data?.error?.message || 'Error al registrarse'
          toast.error(message)
          return { success: false, error: message }
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        
        // Limpiar token de axios
        delete api.defaults.headers.common['Authorization']
        
        toast.success('Sesión cerrada')
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
      },

      // Obtener perfil actual del usuario
      getCurrentUser: async () => {
        try {
          const response = await authService.getCurrentUser()
          const restaurant = response.data // El endpoint devuelve directamente el restaurante
          
          set((_) => ({
            user: restaurant
          }))
          
          return { success: true }
        } catch (error) {
          console.error('Error getting current user:', error)
          return { success: false, error }
        }
      },

      // Initialize auth state from localStorage
      initializeAuth: async () => {
        try {
          const token = localStorage.getItem('auth-storage')
          if (token) {
            const authData = JSON.parse(token)
            if (authData.state?.token && authData.state?.isAuthenticated) {
              // Configurar token en axios
              api.defaults.headers.common['Authorization'] = `Bearer ${authData.state.token}`
              console.log('Auth initialized successfully')
              
              // Obtener datos actualizados del usuario
              const auth = get()
              await auth.getCurrentUser()
            }
          }
        } catch (error) {
          console.error('Error parsing auth token:', error)
          // Limpiar datos corruptos
          localStorage.removeItem('auth-storage')
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

// Hook personalizado para usar con React Router
export const useAuth = () => {
  const navigate = useNavigate()
  const auth = useAuthStore()
  
  const login = async (email, password) => {
    const result = await auth.login(email, password)
    if (result.success) {
      navigate('/')
    }
    return result
  }
  
  const register = async (userData) => {
    const result = await auth.register(userData)
    if (result.success) {
      navigate('/')
    }
    return result
  }
  
  const logout = () => {
    auth.logout()
    navigate('/login')
  }
  
  return {
    ...auth,
    login,
    register,
    logout,
    getCurrentUser: auth.getCurrentUser
  }
}

export default useAuthStore 