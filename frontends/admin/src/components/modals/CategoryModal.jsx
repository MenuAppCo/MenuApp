import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Trash2 } from 'lucide-react'
import { useCreateCategory, useUpdateCategory, useUploadCategoryImage } from '../../hooks/useCategories'
import { useMenus } from '../../hooks/useMenus'
import { toast } from 'react-hot-toast'
import { buildImageUrl } from '../../utils/imageUtils'

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  order: z.number().min(1, 'El orden debe ser mayor a 0'),
  isVisible: z.boolean().default(true),
  menuId: z.number().min(1, 'Debes seleccionar un menú'),
})

const CategoryModal = ({ isOpen, onClose, category = null }) => {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(category?.imageUrl || null)
  
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const uploadImageMutation = useUploadCategoryImage()
  const { data: menusData, isLoading: menusLoading } = useMenus()
  
  const isEditing = !!category

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      order: 1,
      isVisible: true,
      menuId: undefined,
    }
  })

  useEffect(() => {
    if (category) {
      setValue('name', category.name)
      setValue('nameEn', category.descriptionEn || '')
      setValue('description', category.description || '')
      setValue('descriptionEn', category.descriptionEn || '')
      setValue('order', category.order)
      setValue('isVisible', category.isVisible)
      setValue('menuId', category.menuId)
      // Construir URL completa para la imagen existente
      if (category.imageUrl) {
        const fullImageUrl = buildImageUrl(category.imageUrl);
        console.log('🔍 Category Modal - Image URL Debug:')
        console.log('  Original imageUrl:', category.imageUrl)
        console.log('  VITE_MEDIA_URL:', import.meta.env.VITE_MEDIA_URL)
        console.log('  Full image URL:', fullImageUrl)
        setImagePreview(fullImageUrl)
      } else {
        setImagePreview(null)
      }
    } else {
      reset()
      // Limpiar URL del objeto si existe
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
      setImagePreview(null)
      setImageFile(null)
      // Si no hay menús cargados, no establecer menuId por defecto
      if (menusData?.data?.data?.length > 0) {
        setValue('menuId', menusData.data.data[0].id)
      }
    }
  }, [category, setValue, reset, menusData, imagePreview])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar el archivo antes de procesarlo
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('El archivo es demasiado grande. Máximo 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen')
        return
      }
      
      setImageFile(file)
      // Usar URL.createObjectURL en lugar de FileReader para evitar corrupción
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
    }
  }

  const removeImage = () => {
    // Limpiar la URL del objeto para liberar memoria
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
  }

  const onSubmit = async (data) => {
    try {
      let categoryId

      if (isEditing) {
        const _ = await updateCategoryMutation.mutateAsync({
          id: category.id,
          data: {
            ...data,
            menuId: data.menuId
          }
        })
        categoryId = category.id
      } else {
        const result = await createCategoryMutation.mutateAsync({
          ...data,
          menuId: data.menuId
        })
        categoryId = result.data.id
      }

      // Subir imagen si se seleccionó una nueva
      if (imageFile && categoryId) {
        const uploadResult = await uploadImageMutation.mutateAsync({
          categoryId,
          imageFile
        })
        
        // Actualizar el preview con la nueva URL de la imagen
        if (uploadResult.data?.image?.url) {
          const fullImageUrl = buildImageUrl(uploadResult.data.image.url);
          setImagePreview(fullImageUrl)
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Categoría' : 'Crear Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre *
            </label>
            <input
              {...register('name')}
              type="text"
              className="input-field mt-1"
              placeholder="Nombre de la categoría"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Menú */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Menú *
            </label>
            <select
              {...register('menuId', { valueAsNumber: true })}
              className="input-field mt-1"
              disabled={menusLoading}
            >
              <option value="">Seleccionar menú</option>
              {menusData?.data?.data?.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </select>
            {errors.menuId && (
              <p className="mt-1 text-sm text-red-600">{errors.menuId.message}</p>
            )}
            {menusLoading && (
              <p className="mt-1 text-sm text-gray-500">Cargando menús...</p>
            )}
          </div>

          {/* Nombre en inglés */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre (Inglés)
            </label>
            <input
              {...register('nameEn')}
              type="text"
              className="input-field mt-1"
              placeholder="Category name (English)"
            />
            {errors.nameEn && (
              <p className="mt-1 text-sm text-red-600">{errors.nameEn.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field mt-1"
              placeholder="Descripción de la categoría"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Descripción en inglés */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción (Inglés)
            </label>
            <textarea
              {...register('descriptionEn')}
              rows={3}
              className="input-field mt-1"
              placeholder="Category description (English)"
            />
            {errors.descriptionEn && (
              <p className="mt-1 text-sm text-red-600">{errors.descriptionEn.message}</p>
            )}
          </div>

          {/* Orden */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Orden *
            </label>
            <input
              {...register('order', { valueAsNumber: true })}
              type="number"
              min="1"
              className="input-field mt-1"
              placeholder="1"
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
            )}
          </div>

          {/* Visibilidad */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Visible
              </p>
              <p className="text-xs text-gray-500">
                Mostrar esta categoría en el menú
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                {...register('isVisible')}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la categoría
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">
                  Haz clic para subir una imagen
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="category-image"
                />
                <label
                  htmlFor="category-image"
                  className="btn-outline text-sm cursor-pointer"
                >
                  Seleccionar imagen
                </label>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              className="btn-primary flex-1"
            >
              {createCategoryMutation.isPending || updateCategoryMutation.isPending
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryModal 