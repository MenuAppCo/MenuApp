import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Star } from 'lucide-react'
import { useProducts, useDeleteProduct } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { useMenus } from '../../hooks/useMenus'
import { useRestaurant } from '../../hooks/useRestaurant'
import { usePageTitle } from '../../hooks/usePageTitle'
import ProductModal from '../../components/modals/ProductModal'
import ProductViewModal from '../../components/modals/ProductViewModal'
import ConfirmModal from '../../components/modals/ConfirmModal'
import { buildImageUrl } from '../../utils/imageUtils'

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewProduct, setViewProduct] = useState(null)
  const [filterValues, setFilterValues] = useState({
    menuId: '',
    categoryId: ''
  })
  
  const { data: productsData, isLoading, error } = useProducts({
    search: searchTerm,
    ...filters
  })
  
  const { data: categoriesData } = useCategories()
  const { data: menusData } = useMenus()
  const { data: restaurantData } = useRestaurant()
  
  const deleteProductMutation = useDeleteProduct()

  // Actualizar título de la página
  usePageTitle('Productos - Admin - MenuApp')
  
  // Debug logs
  console.log('📊 Products Data:', productsData)
  console.log('📋 Products Array:', productsData?.data)
  console.log('📈 Total Products:', productsData?.meta?.total)
  
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteProductMutation.mutate(id)
    }
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setTimeout(() => {
      setIsModalOpen(true)
    }, 0)
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleOpenFilters = () => {
    setIsFilterModalOpen(true)
  }

  const handleCloseFilters = () => {
    setIsFilterModalOpen(false)
  }

  const handleApplyFilters = () => {
    const newFilters = {}
    if (filterValues.menuId) newFilters.menuId = filterValues.menuId
    if (filterValues.categoryId) newFilters.categoryId = filterValues.categoryId
    
    setFilters(newFilters)
    setIsFilterModalOpen(false)
  }

  const handleClearFilters = () => {
    setFilterValues({ menuId: '', categoryId: '' })
    setFilters({})
    setIsFilterModalOpen(false)
  }

  const handleView = (product) => {
    setViewProduct(product)
    setIsViewModalOpen(true)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewProduct(null)
  }

  const hasActiveFilters = Object.keys(filters).length > 0
  
  const products = productsData?.data || []
  const totalProducts = productsData?.meta?.total || 0
  const categories = categoriesData?.data || []
  const menus = menusData?.data?.data || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="card animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <p className="text-red-600">Error al cargar productos</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600">
            {totalProducts} productos en total
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={handleOpenFilters}
            className={`btn-outline flex items-center ${hasActiveFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={buildImageUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description || 'Sin descripción'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  {`$${product.price.toLocaleString('es-CO', { minimumFractionDigits: 0 })} COP`}
                </span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleView(product)}
                    className="btn-outline text-sm py-1 px-3 flex items-center"
                    title="Ver"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={() => handleEdit(product)}
                    className="btn-outline text-sm py-1 px-3 flex items-center"
                    title="Editar"
                  >
                    <Edit className="h-3 w-3" />
                  </button>
                  <button 
                    className="btn-outline text-sm py-1 px-3 text-red-600 hover:text-red-700 flex items-center"
                    title="Eliminar"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteProductMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                {/* Información de categoría y menú */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Categoría: {product.category?.name || 'Sin categoría'}</span>
                  <span>Menú: {product.category?.menu?.name || 'Sin menú'}</span>
                </div>
                {/* Estados del producto */}
                <div className="flex flex-wrap gap-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.visible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.visible ? 'Visible' : 'Oculto'}
                  </span>
                  {product.featured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Destacado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Plus className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay productos
          </h3>
          <p className="text-gray-500 mb-4">
            Comienza agregando tu primer producto para mostrar en el menú.
          </p>
          <button 
            onClick={handleCreate}
            className="btn-primary"
          >
            Agregar Producto
          </button>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />

      {/* Product View Modal */}
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        product={viewProduct}
        restaurant={restaurantData?.data}
      />

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
              <button
                onClick={handleCloseFilters}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Filtro por Menú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Menú
                </label>
                <select
                  value={filterValues.menuId}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, menuId: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Todos los menús</option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={filterValues.categoryId}
                  onChange={(e) => setFilterValues(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={handleClearFilters}
                className="btn-outline flex-1"
              >
                Limpiar
              </button>
              <button
                onClick={handleApplyFilters}
                className="btn-primary flex-1"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products 