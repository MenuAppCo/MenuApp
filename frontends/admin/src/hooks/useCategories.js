import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { categoryService } from '../services/categoryService'

export const useCategories = (params = {}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: async () => {
      const response = await categoryService.getCategories(params)
      console.log('🔍 Respuesta de categorías:', response)
      // Devolver directamente los datos para simplificar el acceso
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.refetchQueries({ queryKey: ['categories'] })
      toast.success('Categoría creada exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al crear la categoría'
      toast.error(message)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', id] })
      toast.success('Categoría actualizada exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar la categoría'
      toast.error(message)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      // Usar el mensaje personalizado del backend si está disponible
      const message = response?.data?.message || 'Categoría eliminada exitosamente'
      toast.success(message)
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al eliminar la categoría'
      toast.error(message)
    },
  })
}

export const useUploadCategoryImage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ categoryId, imageFile }) => categoryService.uploadImage(categoryId, imageFile),
    onSuccess: (_, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] })
      toast.success('Imagen subida exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al subir la imagen'
      toast.error(message)
    },
  })
} 