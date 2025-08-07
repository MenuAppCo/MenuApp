import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { productService } from '../services/productService'

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const response = await productService.getProducts(params)
      console.log('🔍 Respuesta de productos:', response)
      // Devolver directamente los datos para simplificar el acceso
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      // Invalidar todas las queries de productos para asegurar actualización
      queryClient.invalidateQueries({ queryKey: ['products'] })
      // También refrescar inmediatamente
      queryClient.refetchQueries({ queryKey: ['products'] })
      toast.success('Producto creado exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al crear el producto'
      toast.error(message)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
      queryClient.refetchQueries({ queryKey: ['products'] })
      toast.success('Producto actualizado exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al actualizar el producto'
      toast.error(message)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.refetchQueries({ queryKey: ['products'] })
      toast.success('Producto eliminado exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al eliminar el producto'
      toast.error(message)
    },
  })
}

export const useUploadProductImage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ productId, imageFile }) => productService.uploadImage(productId, imageFile),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', productId] })
      toast.success('Imagen subida exitosamente')
    },
    onError: (error) => {
      const message = error.response?.data?.error?.message || 'Error al subir la imagen'
      toast.error(message)
    },
  })
} 