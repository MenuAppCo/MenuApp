import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useRestaurantInfo } from '../../hooks/usePublicMenu'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Phone, MapPin,  Calendar,  ThumbsUp, Instagram, Facebook, ExternalLink } from 'lucide-react'
import ImageWithFallback from '../../components/ImageWithFallback'
import MobileMenuContainer from '../../components/MobileMenuContainer'

const PublicRestaurant = () => {
  const { slug } = useParams()
  const { data, isLoading, error } = useRestaurantInfo(slug)
  const [showAddressModal, setShowAddressModal] = useState(false)

  // Actualizar título de la página con el nombre del restaurante
  const restaurantName = data?.data?.restaurant?.name
  usePageTitle(restaurantName ? `${restaurantName} - Menú Digital` : 'Menú Digital')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Cargando restaurante...</p>
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

  // Validar que tenemos datos del restaurante
  if (!data?.data?.restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-3">🍽️</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar restaurante</h1>
          <p className="text-gray-500 text-sm">No se pudieron cargar los datos del restaurante.</p>
        </div>
      </div>
    )
  }

  const { restaurant } = data.data

  const settings = restaurant.settings || {};

  // Función para manejar clics en botones de acción
  const handleActionClick = (action) => {
    switch (action) {
      case 'menu':
        window.location.href = `/restaurant/${slug}/menus`
        break
      case 'reservations':
        if (restaurant.phone) {
          window.open(`tel:${restaurant.phone}`, '_blank')
        }
        break
      case 'location':
        if (restaurant.googleMapsUrl) {
          window.open(restaurant.googleMapsUrl, '_blank')
        } else if (restaurant.address) {
          setShowAddressModal(true)
        }
        break
      case 'contact':
        if (restaurant.phone) {
          window.open(`tel:${restaurant.phone}`, '_blank')
        }
        break
      case 'rating':
        {
          // Si existe Tripadvisor, abrir ese enlace, sino mostrar mensaje
          const tripadvisorUrl = restaurant.socialMedia?.tripadvisor?.url
          if (tripadvisorUrl && tripadvisorUrl.trim() !== '') {
            window.open(tripadvisorUrl, '_blank')
          } else {
            alert('Función de calificaciones próximamente disponible')
          }
          break
        }
      default:
        break
    }
  }

  // Función para manejar clics en redes sociales
  const handleSocialMediaClick = (platform, url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  // Obtener redes sociales activas con validación mejorada (excluyendo Tripadvisor)
  const activeSocialMediaList = (() => {
    try {
      if (!restaurant.socialMedia || typeof restaurant.socialMedia !== 'object') {
        console.log('🔍 No hay socialMedia o no es un objeto')
        return []
      }

      const entries = Object.entries(restaurant.socialMedia)
      console.log('🔍 Entries de socialMedia:', entries)

      const filtered = entries
        .filter(([platform, config]) => {
          // Excluir Tripadvisor de las redes sociales
          if (platform === 'tripadvisor') {
            return false
          }
          
          const isValid = config && 
                         typeof config === 'object' && 
                         (config.active === true || config.isActive === true) && 
                         config.url && 
                         config.url.trim() !== ''
          console.log(`🔍 ${platform}:`, { config, isValid })
          return isValid
        })
        .map(([platform, config]) => ({ 
          platform, 
          url: config.url,
          active: config.active || config.isActive 
        }))

      console.log('🔍 Redes sociales filtradas:', filtered)
      return filtered
    } catch (error) {
      console.error('🔍 Error procesando redes sociales:', error)
      return []
    }
  })()

  return (
    <MobileMenuContainer>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
          {/* Header del restaurante */}
          <header className="bg-white border-b border-gray-200 flex-shrink-0">
            <div className="px-4 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 text-center">
                  <h1 className="text-xl font-bold text-gray-900">{restaurant.name}</h1>
                  {restaurant.description && (
                    <p className="text-gray-600 text-sm mt-1">{restaurant.description}</p>
                  )}
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

          <main className="p-4 space-y-6 flex-1 flex flex-col justify-center min-h-0">
            {/* Botón Menú */}
            <button
              onClick={() => handleActionClick('menu')}
              className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-3"
            >
              
              Ver Menú
            </button>

            {/* Botones de servicios */}
            <div className="grid grid-cols-2 gap-3">
              {settings.showReservations !== false && (
                <button
                  onClick={() => handleActionClick('reservations')}
                  className="bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-primary-300 hover:text-primary-700 transition-colors flex flex-col items-center space-y-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Reservas</span>
                </button>
              )}
              {settings.showLocation !== false && (restaurant.googleMapsUrl || restaurant.address) && (
                <button
                  onClick={() => handleActionClick('location')}
                  className="bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-primary-300 hover:text-primary-700 transition-colors flex flex-col items-center space-y-2"
                >
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">Ubicación</span>
                </button>
              )}
              {settings.showContact !== false && (
                <button
                  onClick={() => handleActionClick('contact')}
                  className="bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-primary-300 hover:text-primary-700 transition-colors flex flex-col items-center space-y-2"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-sm">Contacto</span>
                </button>
              )}
              {settings.showRating !== false && (
                <button
                  onClick={() => handleActionClick('rating')}
                  className="bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:border-primary-300 hover:text-primary-700 transition-colors flex flex-col items-center space-y-2"
                >
                  <ThumbsUp className="h-5 w-5" />
                  <span className="text-sm">Calificar</span>
                </button>
              )}
            </div>
          </main>

          {/* Redes sociales */}
          {activeSocialMediaList.length > 0 && (
            <div className="rounded-lg p-4">
              <div className="flex justify-center space-x-4">
                {activeSocialMediaList.map(({ platform, url }) => (
                  <button
                    key={platform}
                    onClick={() => handleSocialMediaClick(platform, url)}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                    title={`Síguenos en ${platform}`}
                  >
                    {platform === 'instagram' && <Instagram className="h-5 w-5 text-pink-600" />}
                    {platform === 'facebook' && <Facebook className="h-5 w-5 text-blue-600" />}
                    {platform === 'tiktok' && <span className="text-black font-bold text-sm">TikTok</span>}
                    {!['instagram', 'facebook', 'tiktok'].includes(platform) && (
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

      {/* Modal de dirección */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Dirección</h2>
            <p className="text-gray-700 mb-4">{restaurant.address}</p>
            <button
              onClick={() => setShowAddressModal(false)}
              className="btn-primary w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </MobileMenuContainer>
  )
}

export default PublicRestaurant 