import { useParams, Link } from 'react-router-dom'
import { useRestaurantInfo, useRestaurantMenus } from '../../hooks/usePublicMenu'
import { usePageTitle } from '../../hooks/usePageTitle'
import { ArrowLeft, Instagram, Facebook, Star, ExternalLink } from 'lucide-react'
import ImageWithFallback from '../../components/ImageWithFallback'
import MobileMenuContainer from '../../components/MobileMenuContainer'

const PublicMenus = () => {
  const { slug } = useParams()
  const { data: restaurantData, isLoading: restaurantLoading, error: restaurantError } = useRestaurantInfo(slug)
  const { data: menusData, isLoading: menusLoading, error: menusError } = useRestaurantMenus(slug)

  // TODO Actualizar título de la página con el nombre del restaurante
  const restaurantName = restaurantData?.data?.restaurant?.name
  usePageTitle(restaurantName ? `${restaurantName} - Menús` : 'Menús')

  const isLoading = restaurantLoading || menusLoading
  const error = restaurantError || menusError

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Cargando menús...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-3">🍽️</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Restaurante no encontrado</h1>
          <p className="text-gray-500 text-sm">El restaurante que buscas no está disponible.</p>
        </div>
      </div>
    )
  }

  const { restaurant } = restaurantData.data
  const menus = menusData?.data?.menus || []

  // Verificar si al menos un menú tiene descripción
  const hasAnyDescription = menus.some(menu => menu.description && menu.description.trim() !== '')


  return (
    <MobileMenuContainer>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {/* Header con botón de regreso */}
          <header className="bg-white border-b border-gray-200 flex-shrink-0">
            <div className="px-4 py-4">
              <div className="flex items-center space-x-3">
                <Link
                  to={`/restaurants/${slug}`}
                  className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-bold text-gray-900">{restaurant.name}</h1>
                  <p className="text-gray-500 text-sm">Nuestros menús</p>
                </div>
              </div>
            </div>
          </header>

          {/* Logo grande centrado */}
          {restaurant.logoUrl && (
            <div className="flex justify-center mb-6 mt-6">
              <ImageWithFallback 
                src={restaurant.logoUrl} 
                alt={restaurant.name}
                className="h-40 w-40 object-contain rounded-lg"
                size="large"
              />
            </div>
          )}

          {/* Lista de menús */}
          <main className="p-4 flex-1 flex flex-col justify-start items-center">
            {menus.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-300 text-5xl mb-4">🍽️</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">No hay menús disponibles</h2>
                <p className="text-gray-500 text-sm">Pronto tendremos nuestros menús disponibles.</p>
              </div>
            ) : (
              <div className="space-y-4 w-full flex flex-col items-center justify-center">
                {menus.map((menu) => (
                  <Link
                    key={menu.id}
                    to={`/menu/${slug}/${menu.type || 'food'}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all w-full max-w-md"
                  >
                    {hasAnyDescription ? (
                      // Layout consistente cuando al menos uno tiene descripción: todos con flecha
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {menu.name}
                          </h3>
                          {menu.description && (
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {menu.description}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <ArrowLeft className="h-3 w-3 text-gray-500 rotate-180" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Layout centrado solo cuando NINGUNO tiene descripción
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {menu.name}
                        </h3>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </main>

          {/* Redes sociales */}
          {restaurant.socialMedia && Object.keys(restaurant.socialMedia).length > 0 && (
            <div className="rounded-lg p-4">
              <div className="flex justify-center space-x-4">
                {Object.entries(restaurant.socialMedia)
                  .filter(([_, config]) => (config.active === true || config.isActive === true) && config.url && config.url.trim() !== "")
                  .map(([platform, config]) => (
                    <button
                      key={platform}
                      onClick={() => window.open(config.url, '_blank')}
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-shadow hover:shadow-md"
                      title={`Síguenos en ${platform}`}
                    >
                      {platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                      {platform === 'facebook' && <Facebook className="h-5 w-5 text-blue-600" />}
                      {platform === 'tripadvisor' && <Star className="h-5 w-5 text-green-600" />}
                      {platform === 'tiktok' && <span className="text-black font-bold text-sm">TikTok</span>}
                      {!['instagram', 'facebook', 'tripadvisor', 'tiktok'].includes(platform) && (
                        <ExternalLink className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-auto p-4 text-center flex-shrink-0">
            <p className="text-xs text-gray-400">Menú digital por MenuApp</p>
          </footer>
        </div>
      </div>
    </MobileMenuContainer>
  )
}

export default PublicMenus 