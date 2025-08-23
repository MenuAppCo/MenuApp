import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react'
import { useCategories, useDeleteCategory } from '../../hooks/useCategories'
import { useMenus } from '../../hooks/useMenus'
import CategoryModal from '../../components/modals/CategoryModal'
import { buildImageUrl } from '../../utils/imageUtils'

const Categories = () => {
  const [filters, setFilters] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { data: menusData } = useMenus()
  const menus = menusData?.data?.data || []
  const [selectedMenuId, setSelectedMenuId] = useState('')
  
  const { data: categoriesData, isLoading, error } = useCategories(filters)
  const deleteCategoryMutation = useDeleteCategory()

  useEffect(() => {
    document.title = 'Categorías - Admin - MenuApp'
  }, [])
  
  
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará todos los productos asociados.')) {
      deleteCategoryMutation.mutate(id)
    }
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCategory(null)
  }
  
  const categories = categoriesData?.data || []
  const totalCategories = categoriesData?.meta?.total || 0

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
            <p className="text-gray-600">Cargando categorías...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="card animate-pulse">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gray-200"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
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
            <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
            <p className="text-red-600">Error al cargar categorías</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600">
            {totalCategories} categorías en total
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Categoría
        </button>
      </div>

      {/* Filter by menu */}
      <div className="card mb-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por menú:</label>
          <select
            className="input-field"
            value={selectedMenuId}
            onChange={e => {
              setSelectedMenuId(e.target.value)
              setFilters(f => ({ ...f, menuId: e.target.value }))
            }}
          >
            <option value="">Todos los menús</option>
            {menus.map(menu => (
              <option key={menu.id} value={menu.id}>{menu.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  {category.imageUrl ? (
                    <img
                      src={buildImageUrl(category.imageUrl)}
                      alt={category.name}
                      className="h-6 w-6 object-cover"
                      onError={(e) => {
                        console.error('Error loading image:', e.target.src)
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <FolderOpen className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category._count?.products || 0} productos
                  </p>
                  {category.menu && (
                    <p className="text-xs text-blue-600 mt-1">
                      Menú: {category.menu.name}
                    </p>
                  )}
                  {category.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={() => handleEdit(category)}
                  className="btn-outline text-sm py-1 px-3 flex items-center"
                  title="Editar"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </button>
                <button 
                  className="btn-outline text-sm py-1 px-3 text-red-600 hover:text-red-700 flex items-center"
                  title="Eliminar"
                  onClick={() => handleDelete(category.id)}
                  disabled={deleteCategoryMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  category.isVisible 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.isVisible ? 'Visible' : 'Oculto'}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Orden: {category.order}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FolderOpen className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay categorías
          </h3>
          <p className="text-gray-500 mb-4">
            Crea tu primera categoría para organizar tus productos.
          </p>
          <button 
            onClick={handleCreate}
            className="btn-primary"
          >
            Crear Categoría
          </button>
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        category={selectedCategory}
      />
    </div>
  )
}

export default Categories 