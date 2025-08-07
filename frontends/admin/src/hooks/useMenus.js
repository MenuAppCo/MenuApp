import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { menuService } from '../services/menuService'

// Hook para obtener todos los menús
export const useMenus = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: () => menuService.getMenus(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener un menú específico
export const useMenu = (menuId) => {
  return useQuery({
    queryKey: ['menu', menuId],
    queryFn: () => menuService.getMenu(menuId),
    enabled: !!menuId,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para crear un menú
export const useCreateMenu = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (menuData) => menuService.createMenu(menuData),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus'])
    },
  })
}

// Hook para actualizar un menú
export const useUpdateMenu = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, ...menuData }) => menuService.updateMenu(id, menuData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['menus'])
      queryClient.invalidateQueries(['menu', variables.id])
    },
  })
}

// Hook para eliminar un menú
export const useDeleteMenu = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (menuId) => menuService.deleteMenu(menuId),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus'])
    },
  })
}

// Hook para reordenar menús
export const useReorderMenus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => menuService.reorderMenus(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['menus'])
    },
  })
} 