import { useQuery } from '@tanstack/react-query'
import { publicMenuService } from '../services/publicMenuService'

export const usePublicMenu = (slug, menuType = 'food') => {
  return useQuery({
    queryKey: ['publicMenu', slug, menuType],
    queryFn: () => publicMenuService.getPublicMenu(slug, menuType),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  })
}

export const useRestaurantInfo = (slug) => {
  return useQuery({
    queryKey: ['restaurantInfo', slug],
    queryFn: () => publicMenuService.getRestaurantInfo(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  })
}

export const useRestaurantMenus = (slug) => {
  return useQuery({
    queryKey: ['restaurantMenus', slug],
    queryFn: () => publicMenuService.getRestaurantMenus(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  })
} 