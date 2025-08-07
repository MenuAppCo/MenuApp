import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { useCreateMenu, useUpdateMenu } from '../../hooks/useMenus'
import { toast } from 'react-hot-toast'

const MenuModal = ({ isOpen, onClose, menu, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'FOOD',
    isActive: true
  })

  const createMenuMutation = useCreateMenu()
  const updateMenuMutation = useUpdateMenu()

  const menuTypes = [
    { value: 'FOOD', label: 'Comida', description: 'Platos principales y especialidades' },
    { value: 'DRINKS', label: 'Bebidas', description: 'Cócteles, vinos y bebidas' },
    { value: 'DESSERTS', label: 'Postres', description: 'Dulces y postres' },
    { value: 'APPETIZERS', label: 'Entradas', description: 'Aperitivos y entradas' },
    { value: 'SPECIALS', label: 'Especiales', description: 'Platos especiales del día' }
  ]

  useEffect(() => {
    if (menu) {
      setFormData({
        name: menu.name || '',
        description: menu.description || '',
        type: menu.type || 'FOOD',
        isActive: menu.isActive !== undefined ? menu.isActive : true
      })
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'FOOD',
        isActive: true
      })
    }
  }, [menu])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('El nombre del menú es requerido')
      return
    }

    try {
      if (menu) {
        await updateMenuMutation.mutateAsync({
          id: menu.id,
          ...formData
        })
        toast.success('Menú actualizado exitosamente')
      } else {
        await createMenuMutation.mutateAsync(formData)
        toast.success('Menú creado exitosamente')
      }
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el menú')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {menu ? 'Editar Menú' : 'Nuevo Menú'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del menú *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: Nuestra carta, Bebidas, etc."
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe brevemente el contenido del menú"
            />
          </div>

          {/* Tipo de menú */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de menú
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {menuTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {menuTypes.find(t => t.value === formData.type)?.description}
            </p>
          </div>

          {/* Estado */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Menú activo
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createMenuMutation.isLoading || updateMenuMutation.isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>
                {createMenuMutation.isLoading || updateMenuMutation.isLoading
                  ? 'Guardando...'
                  : menu ? 'Actualizar' : 'Crear'
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MenuModal 