import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { usePublicMenu } from '../../hooks/usePublicMenu'
import { usePageTitle } from '../../hooks/usePageTitle'
import { Phone, MapPin, Globe, Star, ArrowLeft } from 'lucide-react'
import ImageWithFallback from '../../components/ImageWithFallback'
import ProductViewModal from '../../components/modals/ProductViewModal'
import MobileMenuContainer from '../../components/MobileMenuContainer'

const PublicMenu = () => {
  const { slug, menuType = 'food' } = useParams()
  const { data, isLoading, error } = usePublicMenu(slug, menuType)
  
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const categoryRefs = useRef({})
  const scrollContainerRef = useRef(null)

  // Actualizar título de la página con el nombre del restaurante y tipo de menú
  const restaurantName = data?.data?.restaurant?.name
  const menuTypeText = menuType.toLowerCase() === 'food' ? 'Comida' : menuType.toLowerCase() === 'drinks' ? 'Bebidas' : 'Menú'
  usePageTitle(restaurantName ? `${restaurantName} - ${menuTypeText}` : menuTypeText)

  useEffect(() => {
    if (data?.data?.categories?.length > 0) {
      setActiveCategory(data.data.categories[0].id)
    }
  }, [data])

  // Función para hacer scroll a una categoría específica
  const scrollToCategory = (categoryId) => {
    const element = categoryRefs.current[categoryId]
    if (element && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const elementTop = element.offsetTop - 200 // Ajustar para el header y nav
      
      container.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
      setActiveCategory(categoryId)
    }
  }



  useEffect(() => {
      // Función para detectar la categoría visible durante el scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    
    const container = scrollContainerRef.current
    const scrollTop = container.scrollTop + 200 // Offset para el header y nav
    
    const categories = data?.data?.categories || []
    let newActiveCategory = categories[0]?.id
    
    for (const category of categories) {
      const element = categoryRefs.current[category.id]
      if (element) {
        const elementTop = element.offsetTop
        const elementBottom = elementTop + element.offsetHeight
        
        if (scrollTop >= elementTop && scrollTop < elementBottom) {
          newActiveCategory = category.id
          break
        }
      }
    }
    
    if (newActiveCategory !== activeCategory) {
      setActiveCategory(newActiveCategory)
    }
  }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [data, activeCategory])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Cargando menú...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-3">🍽️</div>
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Menú no encontrado</h1>
          <p className="text-gray-500 text-sm">El restaurante que buscas no está disponible.</p>
        </div>
      </div>
    )
  }

  const { restaurant, categories } = data.data
  const settings = restaurant.settings || {};

  return (
    <MobileMenuContainer>
      <div className="min-h-screen bg-gray-50">
        {/* Contenedor principal con scroll único */}
        <div 
          ref={scrollContainerRef}
          className="max-w-md mx-auto bg-white min-h-screen overflow-y-auto"
          style={{ height: '100vh' }}
        >
          {/* Header del restaurante - Parte del scroll */}
          <header className="bg-white border-b border-gray-200">
            <div className="px-4 py-4">
              <div className="flex items-center space-x-3">
                <Link
                  to={`/restaurant/${slug}/menus`}
                  className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-bold text-gray-900">{restaurant.name}</h1>
                  {restaurant.description && (
                    <p className="text-gray-500 text-xs mt-1">{restaurant.description}</p>
                  )}
                </div>
                {restaurant.logoUrl && (
                  <ImageWithFallback 
                    src={restaurant.logoUrl} 
                    alt={restaurant.name}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0 ml-2"
                    size="medium"
                  />
                )}
              </div>
            </div>
          </header>

          {/* Navegador horizontal de categorías - Parte del scroll */}
          <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="flex overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => scrollToCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </nav>

          {/* Contenido del menú */}
          <main className="pb-20">
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-gray-300 text-5xl mb-4">🍽️</div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Menú en preparación</h2>
                <p className="text-gray-500 text-sm text-center">Pronto tendremos nuestro menú disponible.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {categories.map((category) => (
                  <section 
                    key={category.id} 
                    ref={(el) => (categoryRefs.current[category.id] = el)}
                    className="border-b border-gray-100"
                  >
                    {/* Header de la categoría */}
                    <div className="px-6 py-6 bg-white">
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-900 text-center">{category.name}</h2>
                        {category.description && (
                          <p className="text-gray-600 text-sm mt-1 text-center">{category.description}</p>
                        )}
                      </div>
                      {category.imageUrl && (
                        <div className="flex justify-center mb-2">
                          <ImageWithFallback 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="h-32 w-full max-w-xs object-cover"
                            size="original"
                          />
                        </div>
                      )}
                    </div>

                    {/* Productos de la categoría - Lista vertical centrada */}
                    <div className="divide-y divide-gray-50">
                      {category.products.map((product) => (
                        <div 
                          key={product.id} 
                          className="px-6 py-6 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="flex space-x-4">
                            {settings.showImages !== false && product.imageUrl && product.imageVisible && (
                              <ImageWithFallback 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
                                size="medium"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {product.name}
                                    </h3>
                                    {product.featured && (
                                      <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />
                                    )}
                                  </div>
                                  {product.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                      {product.description}
                                    </p>
                                  )}
                                </div>
                                {settings.showPrices !== false && product.price && (
                                  <div className="ml-4 text-right flex-shrink-0">
                                    <span className="text-lg font-bold text-gray-900">
                                      {`$${product.price.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1">COP</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>

          {/* Footer */}
          <footer className="mt-auto p-4 text-center">
            {(restaurant.phone || restaurant.address || restaurant.website) && (
              <div className="mb-4 space-y-2 text-xs text-gray-500">
                {restaurant.phone && (
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                {restaurant.address && (
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
                {restaurant.website && (
                  <div className="flex items-center justify-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span>Visitar sitio web</span>
                    </a>
                  </div>
                )}
              </div>
            )}
            <p className="text-xs text-gray-400">Menú digital por MenuApp</p>
          </footer>
        </div>
      </div>
      
      {/* Modal de producto */}
      <ProductViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        restaurant={restaurant}
      />
    </MobileMenuContainer>
  )
}

export default PublicMenu 