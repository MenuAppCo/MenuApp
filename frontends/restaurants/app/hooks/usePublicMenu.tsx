import { useQuery } from '@tanstack/react-query'
import { publicMenuService } from '../services/publicMenuService'

export const usePublicMenu = (slug: string | undefined, menuType: string = 'food') => {
  return useQuery({
    queryKey: ['publicMenu', slug, menuType],
    queryFn: () => publicMenuService.getPublicMenu(slug, menuType),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export const useRestaurantInfo = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['restaurantInfo', slug],
    queryFn: () => publicMenuService.getRestaurantInfo(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

export const useRestaurantMenus = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['restaurantMenus', slug],
    queryFn: () => publicMenuService.getRestaurantMenus(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
} 