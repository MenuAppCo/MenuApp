import { useState } from 'react'
import { Plus, Edit, Trash2, Menu, ArrowUp, ArrowDown } from 'lucide-react'
import { useMenus } from '../../hooks/useMenus'
import { useDeleteMenu } from '../../hooks/useMenus'
import { useReorderMenus } from '../../hooks/useMenus'
import { usePageTitle } from '../../hooks/usePageTitle'
import { toast } from 'react-hot-toast'
import MenuModal from '../../components/modals/MenuModal'
import ConfirmModal from '../../components/modals/ConfirmModal'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Componente para elementos arrastrables
const SortableItem = ({ menu, onEdit, onDelete, getMenuTypeLabel, getMenuTypeColor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all ${
        isDragging ? 'shadow-lg rotate-2' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div {...attributes} {...listeners} className="cursor-move">
            <div className="flex flex-col space-y-1">
              <ArrowUp className="h-3 w-3 text-gray-400" />
              <ArrowDown className="h-3 w-3 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-medium text-gray-900">{menu.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMenuTypeColor(menu.type)}`}>
                {getMenuTypeLabel(menu.type)}
              </span>
            </div>
            {menu.description && (
              <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>Orden: {menu.order}</span>
              <span>Estado: {menu.isActive ? 'Activo' : 'Inactivo'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(menu)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(menu)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const Menus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [deletingMenu, setDeletingMenu] = useState(null)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const { data: menusData, isLoading, error, refetch } = useMenus()
  const deleteMenuMutation = useDeleteMenu()
  const reorderMenusMutation = useReorderMenus()

  // Actualizar título de la página
  usePageTitle('Menús - Admin - MenuApp')

  console.log('🔍 menusData:', menusData)
  console.log('🔍 menusData?.data:', menusData?.data)
  console.log('🔍 menusData?.data?.data:', menusData?.data?.data)
  
  const menus = Array.isArray(menusData?.data?.data) ? menusData.data.data : []
  console.log('🔍 menus:', menus, 'Type:', typeof menus, 'Is Array:', Array.isArray(menus))
  const planLimits = {
    FREE: 2,
    BASIC: 5,
    PREMIUM: 10,
    ENTERPRISE: -1 // Sin límite
  }

  const currentPlan = 'FREE' // Esto vendría del contexto del usuario
  const maxMenus = planLimits[currentPlan]
  const canCreateMenu = maxMenus === -1 || menus.length < maxMenus

  const handleCreateMenu = () => {
    setEditingMenu(null)
    setIsModalOpen(true)
  }

  const handleEditMenu = (menu) => {
    setEditingMenu(menu)
    setIsModalOpen(true)
  }

  const handleDeleteMenu = (menu) => {
    setDeletingMenu(menu)
    setIsConfirmModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingMenu) return

    try {
      await deleteMenuMutation.mutateAsync(deletingMenu.id)
      toast.success('Menú eliminado exitosamente')
      refetch()
    } catch (_) {
      toast.error('Error al eliminar el menú')
    } finally {
      setIsConfirmModalOpen(false)
      setDeletingMenu(null)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = menus.findIndex(menu => menu.id === active.id)
      const newIndex = menus.findIndex(menu => menu.id === over.id)

      const newMenus = arrayMove(menus, oldIndex, newIndex)
      const menuIds = newMenus.map(menu => menu.id)
      
      try {
        await reorderMenusMutation.mutateAsync({ menuIds })
        toast.success('Orden actualizado')
        refetch()
      } catch (_) {
        toast.error('Error al actualizar el orden')
      }
    }
  }

  const getMenuTypeLabel = (type) => {
    const types = {
      'FOOD': 'Comida',
      'DRINKS': 'Bebidas',
      'DESSERTS': 'Postres',
      'APPETIZERS': 'Entradas',
      'SPECIALS': 'Especiales'
    }
    return types[type] || type
  }

  const getMenuTypeColor = (type) => {
    const colors = {
      'FOOD': 'bg-orange-100 text-orange-800',
      'DRINKS': 'bg-blue-100 text-blue-800',
      'DESSERTS': 'bg-pink-100 text-pink-800',
      'APPETIZERS': 'bg-green-100 text-green-800',
      'SPECIALS': 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    console.error('Error loading menus:', error)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error al cargar los menús
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Menús</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los menús de tu restaurante
          </p>
        </div>
        <button
          onClick={handleCreateMenu}
          disabled={!canCreateMenu}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            canCreateMenu
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Menú</span>
        </button>
      </div>

      {/* Plan Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-blue-900">Plan {currentPlan}</h3>
            <p className="text-sm text-blue-700">
              {maxMenus === -1 
                ? 'Menús ilimitados' 
                : `${menus.length} de ${maxMenus} menús utilizados`
              }
            </p>
          </div>
          {!canCreateMenu && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Actualizar plan
            </button>
          )}
        </div>
      </div>

      {/* Menús List */}
      {menus.length === 0 ? (
        <div className="text-center py-12">
          <Menu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes menús creados
          </h3>
          <p className="text-gray-600 mb-6">
            Crea tu primer menú para comenzar a organizar tus productos
          </p>
          <button
            onClick={handleCreateMenu}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear mi primer menú
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={menus.map(menu => menu.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {menus.map((menu) => (
                <SortableItem
                  key={menu.id}
                  menu={menu}
                  onEdit={handleEditMenu}
                  onDelete={handleDeleteMenu}
                  getMenuTypeLabel={getMenuTypeLabel}
                  getMenuTypeColor={getMenuTypeColor}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Modals */}
      <MenuModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        menu={editingMenu}
        onSuccess={() => {
          setIsModalOpen(false)
          refetch()
        }}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Menú"
        message={`¿Estás seguro de que quieres eliminar el menú "${deletingMenu?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  )
}

export default Menus 