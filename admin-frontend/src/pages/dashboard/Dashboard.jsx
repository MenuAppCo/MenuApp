import { Users, Package, FolderOpen, Eye, QrCode } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { usePageTitle } from '../../hooks/usePageTitle'
import QRCodeComponent from '../../components/QRCode'
import { buildPublicMenuUrl } from '../../config/env'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, restaurantData } = useAuth()
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({ limit: 1000 })
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories({ limit: 1000 })
  const [forceRender, setForceRender] = useState(false)

  // Actualizar título de la página
  usePageTitle('Admin - MenuApp')

  // Forzar renderización después de 3 segundos si aún está cargando
  useEffect(() => {
    const timer = setTimeout(() => {
      if (productsLoading || categoriesLoading) {
        setForceRender(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [productsLoading, categoriesLoading]);

  // Funciones de navegación
  const handleAddProduct = () => {
    navigate('/products')
  }
  const handleCreateCategory = () => {
    navigate('/categories')
  }

  // Asegurar que data sea un array
  const products = productsData?.data || []
  const categories = categoriesData?.data || []

  const totalProducts = productsData?.meta?.total || products.length || 0
  const totalCategories = categoriesData?.meta?.total || categories.length || 0
  const visibleProducts = Array.isArray(products) ? products.filter(p => p.visible)?.length || 0 : 0
  const featuredProducts = Array.isArray(products) ? products.filter(p => p.featured)?.length || 0 : 0

  const stats = [
    {
      name: 'Total Productos',
      value: totalProducts.toString(),
      icon: Package,
    },
    {
      name: 'Categorías',
      value: totalCategories.toString(),
      icon: FolderOpen,
    },
    {
      name: 'Productos Visibles',
      value: visibleProducts.toString(),
      icon: Eye,
    },
    {
      name: 'Productos Destacados',
      value: featuredProducts.toString(),
      icon: Users,
    },
  ]

  // URL del menú público en el frontend público
  const publicMenuUrl = buildPublicMenuUrl(restaurantData?.slug)

  // Mostrar loading si están cargando los datos y no se ha forzado el render
  if ((productsLoading || categoriesLoading) && !forceRender) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {restaurantData?.name || 'Restaurante'}!
          </h1>
          <p className="text-gray-600">
            Cargando datos...
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="card animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Mostrar error si hay problemas
  if (productsError || categoriesError) {
    console.error('[Dashboard] Error cargando datos:', { productsError, categoriesError });
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {user?.name || 'Restaurante'}!
          </h1>
          <p className="text-red-600">
            Error al cargar los datos del dashboard
          </p>
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700">
              {productsError && `Error productos: ${productsError.message}`}
              {categoriesError && `Error categorías: ${categoriesError.message}`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          ¡Bienvenido, {restaurantData?.name || 'Restaurante'}!
        </h1>
        <p className="text-gray-600">
          Aquí tienes un resumen de tu restaurante
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions and QR Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button
              onClick={handleAddProduct}
              className="w-full btn-primary"
            >
              Agregar Producto
            </button>
            <button
              onClick={handleCreateCategory}
              className="w-full btn-outline"
            >
              Crear Categoría
            </button>
            <a
              href={publicMenuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-outline inline-block text-center"
            >
              Ver Menú Público
            </a>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Código QR del Menú
          </h3>
          <div className="text-center">
            <QRCodeComponent
              url={publicMenuUrl}
              size={150}
              className="mx-auto"
            />
            <p className="text-sm text-gray-600 mt-3">
              Comparte este código QR con tus clientes para que accedan a tu menú digital
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">URL del menú:</p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {publicMenuUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Estado del Sistema
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Estado del servidor</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Activo
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Versión</span>
            <span className="text-sm text-gray-900">v1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Restaurante</span>
            <span className="text-sm text-gray-900">{restaurantData?.name || 'Sin nombre'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard