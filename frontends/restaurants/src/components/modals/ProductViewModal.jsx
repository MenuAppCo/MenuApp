import { X, Star } from 'lucide-react'
import ImageWithFallback from '../ImageWithFallback'

const ProductViewModal = ({ isOpen, onClose, product, restaurant }) => {
  if (!isOpen || !product) return null

  const settings = restaurant?.settings || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Detalles del plato</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {settings.showImages !== false && product.imageUrl && product.imageVisible && (
            <div className="relative">
              <ImageWithFallback
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
                size="large"
              />
              {product.featured && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Destacado
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
              {settings.showPrices !== false && product.price && (
                <div className="text-right">
                  <span className="text-2xl font-bold text-gray-900">
                    {`$${product.price.toLocaleString('es-CO', { minimumFractionDigits: 0 })}`}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">COP</span>
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductViewModal 