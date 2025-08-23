import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Upload, Trash2 } from 'lucide-react'
import { useCreateProduct, useUpdateProduct, useUploadProductImage } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { toast } from 'react-hot-toast'

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  categoryId: z.number().min(1, 'Debes seleccionar una categoría'),
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
})

const ProductModal = ({ isOpen, onClose, product = null }) => {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(product?.imageUrl || null)
  
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const uploadImageMutation = useUploadProductImage()
  const { data: categoriesData } = useCategories()
  
  const isEditing = !!product
  const categories = categoriesData?.data || []

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      price: 0,
      categoryId: undefined,
      visible: true,
      featured: false,
    }
  })

  useEffect(() => {
    if (product) {
      // Modo edición: llenar formulario con datos del producto
      setValue('name', product.name)
      setValue('nameEn', product.nameEn || '')
      setValue('description', product.description || '')
      setValue('descriptionEn', product.descriptionEn || '')
      setValue('price', product.price)
      setValue('categoryId', product.categoryId)
      setValue('visible', product.visible)
      setValue('featured', product.featured)
      // Construir URL completa para la imagen existente
      if (product.imageUrl) {
        const fullImageUrl = `https://${import.meta.env.VITE_MEDIA_URL || 'media.menapp.co'}${product.imageUrl.replace(/\\/g, '/')}`
        setImagePreview(fullImageUrl)
      } else {
        setImagePreview(null)
      }
      setImageFile(null) // Limpiar archivo de imagen
    } else {
      // Modo creación: limpiar completamente el formulario
      reset({
        name: '',
        nameEn: '',
        description: '',
        descriptionEn: '',
        price: 0,
        categoryId: undefined,
        visible: true,
        featured: false,
      })
      setImagePreview(null)
      setImageFile(null)
    }
  }, [product, setValue, reset])

  // Limpiar formulario cuando se abre el modal sin producto
  useEffect(() => {
    if (isOpen && !product) {
      reset({
        name: '',
        nameEn: '',
        description: '',
        descriptionEn: '',
        price: null,
        categoryId: undefined,
        visible: true,
        featured: false,
      })
      setImagePreview(null)
      setImageFile(null)
    }
  }, [isOpen, product, reset])

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

  const handleClose = () => {
    // Limpiar completamente el formulario al cerrar
    reset({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      price: 0,
      categoryId: undefined,
      visible: true,
      featured: false,
    })
    setImagePreview(null)
    setImageFile(null)
    onClose()
  }

  const onSubmit = async (data) => {
    try {
      let productId

      if (isEditing) {
        const _ = await updateProductMutation.mutateAsync({
          id: product.id,
          data
        })
        productId = product.id
      } else {
        const result = await createProductMutation.mutateAsync(data)
        productId = result.data.id
      }

      // Subir imagen si se seleccionó una nueva
      if (imageFile && productId) {
        const uploadResult = await uploadImageMutation.mutateAsync({
          productId,
          imageFile
        })
        
        // Actualizar el preview con la nueva URL de la imagen
        if (uploadResult.data?.image?.url) {
          setImagePreview(`https://${import.meta.env.VITE_MEDIA_URL || 'media.menapp.co'}${uploadResult.data.image.url.replace(/\\/g, '/')}`)
        }
      }

      // Si no está en modo edición, limpiar el formulario después de crear
      if (!isEditing) {
        reset({
          name: '',
          nameEn: '',
          description: '',
          descriptionEn: '',
          price: 0,
          categoryId: undefined,
          visible: true,
          featured: false,
        })
        setImagePreview(null)
        setImageFile(null)
      }

      onClose()
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Editar Producto' : 'Crear Producto'}
          </h2>
          <button
            onClick={handleClose}
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
              placeholder="Nombre del producto"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
              placeholder="Product name (English)"
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
              placeholder="Descripción del producto"
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
              placeholder="Product description (English)"
            />
            {errors.descriptionEn && (
              <p className="mt-1 text-sm text-red-600">{errors.descriptionEn.message}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Precio *
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                {...register('price', { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="input-field pl-8"
                placeholder="0.00"
                onWheel={e => e.target.blur()}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Categoría *
            </label>
            <select
              {...register('categoryId', { valueAsNumber: true })}
              className="input-field mt-1"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Visibilidad */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Visible
              </p>
              <p className="text-xs text-gray-500">
                Mostrar este producto en el menú
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                {...register('visible')}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Destacado */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Destacado
              </p>
              <p className="text-xs text-gray-500">
                Mostrar este producto como destacado
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                {...register('featured')}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del producto
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
                  id="product-image"
                />
                <label
                  htmlFor="product-image"
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
              onClick={handleClose}
              className="btn-outline flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              className="btn-primary flex-1"
            >
              {createProductMutation.isPending || updateProductMutation.isPending
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

export default ProductModal 