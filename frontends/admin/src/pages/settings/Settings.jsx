import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Trash2, Save } from 'lucide-react'
import { useRestaurant, useUpdateRestaurant } from '../../hooks/useRestaurant'
import { toast } from 'react-hot-toast'
import { buildImageUrl } from '../../utils/imageUtils'

const SOCIAL_PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/tuusuario' },
  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/tuusuario' },
  { key: 'tiktok', label: 'TikTok', icon: Globe, placeholder: 'https://tiktok.com/@tuusuario' },
  { key: 'tripadvisor', label: 'Tripadvisor', icon: Globe, placeholder: 'https://tripadvisor.com/...' },
]

const Settings = () => {
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  
  const { data: restaurant, isLoading: restaurantLoading } = useRestaurant()
  const { data: settings, isLoading: settingsLoading } = useRestaurantSettings()
  const updateRestaurantMutation = useUpdateRestaurant()
  const updateSettingsMutation = useUpdateRestaurantSettings()
  const uploadLogoMutation = useUploadRestaurantLogo()
  const { updateTheme } = useTheme()
  const { data: socialMedia, isLoading: socialLoading } = useRestaurantSocialMedia()
  const updateSocialMediaMutation = useUpdateRestaurantSocialMedia()
  const [socialForm, setSocialForm] = useState(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    address: '',
    googleMapsUrl: ''
  })

  // Actualizar título de la página
  usePageTitle('Configuración - Admin - MenuApp')

  // Sincronizar socialForm con socialMedia
  useEffect(() => {
    if (socialMedia) setSocialForm(socialMedia)
  }, [socialMedia])

  // Sincronizar datos del restaurante al cargar
  useEffect(() => {
    if (restaurant?.data) {
      setForm({
        name: restaurant.data.name || '',
        description: restaurant.data.description || '',
        phone: restaurant.data.phone || '',
        address: restaurant.data.address || '',
        googleMapsUrl: restaurant.data.googleMapsUrl || ''
      })
    }
  }, [restaurant])

  const handleLogoChange = (e) => {
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
      
      setLogoFile(file)
      // Usar URL.createObjectURL en lugar de FileReader para evitar corrupción
      const objectUrl = URL.createObjectURL(file)
      setLogoPreview(objectUrl)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      googleMapsUrl: formData.get('googleMapsUrl'),
    }
    
    try {
      await updateRestaurantMutation.mutateAsync(data)
      
      // Subir logo si se seleccionó uno nuevo
      if (logoFile) {
        await uploadLogoMutation.mutateAsync(logoFile)
        // Limpiar la URL del objeto para liberar memoria
        if (logoPreview && logoPreview.startsWith('blob:')) {
          URL.revokeObjectURL(logoPreview)
        }
        setLogoFile(null)
        setLogoPreview(null)
      }
    } catch (error) {
      console.error('Error updating restaurant:', error)
    }
  }

  const handleSettingsSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      showPrices: formData.get('showPrices') === 'on',
      showImages: formData.get('showImages') === 'on',
      primaryColor: formData.get('primaryColor'),
      secondaryColor: formData.get('secondaryColor'),
      primaryLanguage: formData.get('primaryLanguage'),
      multiLanguage: formData.get('multiLanguage') === 'on',
      emailNotifications: formData.get('emailNotifications') === 'on',
      analyticsNotifications: formData.get('analyticsNotifications') === 'on',
      showReservations: formData.get('showReservations') === 'on',
      showContact: formData.get('showContact') === 'on',
      showLocation: formData.get('showLocation') === 'on',
      showRating: formData.get('showRating') === 'on',
    }
    
    try {
      await updateSettingsMutation.mutateAsync(data)
      // Actualizar el tema inmediatamente
      updateTheme(data)
    } catch (error) {
      console.error('Error updating settings:', error)
    }
  }

  const handleSocialChange = (platform, field, value) => {
    setSocialForm((prev) => ({
      ...prev,
      [platform]: {
        ...prev?.[platform],
        [field]: value
      }
    }))
  }

  const handleSocialSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateSocialMediaMutation.mutateAsync(socialForm)
    } catch (error) {
      console.error('Error updating social media:', error)
    }
  }

  if (restaurantLoading || settingsLoading || socialLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600">
          Personaliza tu restaurante y configuración
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Restaurant Info */}
        <div className="card">
          <div className="flex items-center mb-4">
            <SettingsIcon className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Información del Restaurante
            </h3>
          </div>
          <form onSubmit={handleRestaurantSubmit} className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo del Restaurante
              </label>
              {(logoPreview || restaurant?.data?.logoUrl) ? (
                <div className="relative group w-28 h-28 mx-auto">
                  <img
                    src={logoPreview || buildImageUrl(restaurant?.data?.logoUrl)}
                    alt="Logo"
                    className="w-28 h-28 object-cover rounded-lg border shadow"
                  />
                  <label
                    htmlFor="restaurant-logo"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg cursor-pointer transition"
                  >
                    <span className="hidden group-hover:block text-white font-semibold text-xs bg-primary-600 px-3 py-1 rounded">Editar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="restaurant-logo"
                    />
                  </label>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        // Limpiar la URL del objeto para liberar memoria
                        if (logoPreview && logoPreview.startsWith('blob:')) {
                          URL.revokeObjectURL(logoPreview)
                        }
                        setLogoFile(null)
                        setLogoPreview(null)
                      }}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 mb-2">
                    Haz clic para subir un logo
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    id="restaurant-logo"
                  />
                  <label
                    htmlFor="restaurant-logo"
                    className="btn-outline text-sm cursor-pointer"
                  >
                    Seleccionar logo
                  </label>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Restaurante
              </label>
              <input
                name="name"
                type="text"
                className="input-field mt-1"
                placeholder="Nombre del restaurante"
                value={form.name}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                name="description"
                className="input-field mt-1"
                rows={3}
                placeholder="Descripción del restaurante"
                value={form.description}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                name="phone"
                type="tel"
                className="input-field mt-1"
                placeholder="Teléfono"
                value={form.phone}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                name="address"
                type="text"
                className="input-field mt-1"
                placeholder="Dirección del restaurante"
                value={form.address}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Link de Google Maps
              </label>
              <input
                name="googleMapsUrl"
                type="url"
                className="input-field mt-1"
                placeholder="https://maps.google.com/?q=..."
                value={form.googleMapsUrl}
                onChange={handleFormChange}
              />
            </div>
            <button 
              type="submit"
              disabled={updateRestaurantMutation.isPending}
              className="btn-primary"
            >
              {updateRestaurantMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Social Media Card */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Redes Sociales</h3>
          </div>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> El enlace de Tripadvisor se usará en el botón "Calificar" del menú público y no aparecerá como red social.
            </p>
          </div>
          <form onSubmit={handleSocialSubmit} className="space-y-4">
            {SOCIAL_PLATFORMS.map(({ key, _, icon: Icon, placeholder }) => (
              <div key={key} className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-gray-500" />
                <input
                  type="url"
                  className="input-field flex-1"
                  placeholder={placeholder}
                  value={socialForm?.[key]?.url || ''}
                  onChange={e => handleSocialChange(key, 'url', e.target.value)}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={key === 'tripadvisor' ? true : !!socialForm?.[key]?.isActive}
                    onChange={key === 'tripadvisor' ? undefined : e => handleSocialChange(key, 'isActive', e.target.checked)}
                    disabled={key === 'tripadvisor'}
                    className="accent-primary-600"
                  />
                  Visible
                </label>
              </div>
            ))}
            <button
              type="submit"
              disabled={updateSocialMediaMutation.isPending}
              className="btn-primary"
            >
              {updateSocialMediaMutation.isPending ? 'Guardando...' : 'Guardar Redes Sociales'}
            </button>
          </form>
        </div>

        {/* Menu Settings */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Palette className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Configuración del Menú
            </h3>
          </div>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Mostrar Precios
                </p>
                <p className="text-xs text-gray-500">
                  Mostrar precios en el menú público
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="showPrices"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings?.showPrices ?? true}
                  onChange={e => updateSettingsMutation.mutateAsync({ ...settings, showPrices: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Mostrar Imágenes
                </p>
                <p className="text-xs text-gray-500">
                  Mostrar imágenes de productos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="showImages"
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings?.showImages ?? true}
                  onChange={e => updateSettingsMutation.mutateAsync({ ...settings, showImages: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color Principal
              </label>
              <input
                name="primaryColor"
                type="color"
                className="mt-1 h-10 w-full rounded-lg border border-gray-300"
                defaultValue={settings?.primaryColor || "#0ea5e9"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Color Secundario
              </label>
              <input
                name="secondaryColor"
                type="color"
                className="mt-1 h-10 w-full rounded-lg border border-gray-300"
                defaultValue={settings?.secondaryColor || "#f59e0b"}
              />
            </div>
            <button 
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="btn-primary"
            >
              {updateSettingsMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </form>
        </div>

        {/* Language Settings */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Idioma
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Idioma Principal
              </label>
              <select 
                name="primaryLanguage"
                className="input-field mt-1"
                defaultValue={settings?.primaryLanguage || "es"}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Múltiples Idiomas
                </p>
                <p className="text-xs text-gray-500">
                  Permitir cambio de idioma en el menú
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  name="multiLanguage"
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked={settings?.multiLanguage ?? false}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Notificaciones
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Email de Notificaciones
                </p>
                <p className="text-xs text-gray-500">
                  Recibir notificaciones por email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  name="emailNotifications"
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked={settings?.emailNotifications ?? true}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Analytics
                </p>
                <p className="text-xs text-gray-500">
                  Recibir reportes de analytics
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  name="analyticsNotifications"
                  type="checkbox" 
                  className="sr-only peer" 
                  defaultChecked={settings?.analyticsNotifications ?? true}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Parámetros de visibilidad */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Shield className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Parámetros de visibilidad</h3>
          </div>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mostrar botón Reservas</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="showReservations"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={settings?.showReservations ?? true}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mostrar botón Contacto</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="showContact"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={settings?.showContact ?? true}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mostrar botón Ubicación</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="showLocation"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={settings?.showLocation ?? true}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mostrar botón Calificar</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  name="showRating"
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={settings?.showRating ?? true}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="btn-primary"
            >
              {updateSettingsMutation.isPending ? 'Guardando...' : 'Guardar Parámetros'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings 