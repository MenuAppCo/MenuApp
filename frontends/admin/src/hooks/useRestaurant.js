import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { restaurantService } from '../services/restaurantService'

export const useRestaurant = () => {
  return useQuery({
    queryKey: ['restaurant'],
    queryFn: restaurantService.getRestaurant,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useRestaurantSettings = () => {
  return useQuery({
    queryKey: ['restaurant-settings'],
    queryFn: async () => {
      const response = await restaurantService.getSettings()
      console.log('🔧 Settings cargados del backend:', response)
      return response
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateRestaurant = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restaurantService.updateRestaurant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
      toast.success('Información del restaurante actualizada')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar la información'
      toast.error(message)
    },
  })
}

export const useUpdateRestaurantSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restaurantService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-settings'] })
      toast.success('Configuración actualizada')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar la configuración'
      toast.error(message)
    },
  })
}

export const useUploadRestaurantLogo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restaurantService.uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
      toast.success('Logo subido exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al subir el logo'
      toast.error(message)
    },
  })
}

export const useDeleteRestaurantLogo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: restaurantService.deleteLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant'] })
      toast.success('Logo eliminado exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al eliminar el logo'
      toast.error(message)
    },
  })
} 

export const useRestaurantSocialMedia = () => {
  return useQuery({
    queryKey: ['restaurant-social-media'],
    queryFn: restaurantService.getSocialMedia,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateRestaurantSocialMedia = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: restaurantService.updateSocialMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-social-media'] })
      toast.success('Redes sociales actualizadas')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar las redes sociales'
      toast.error(message)
    },
  })
} 