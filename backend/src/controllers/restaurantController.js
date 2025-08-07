const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const restaurantController = {
  async getMyRestaurant(req, res) {
    try {
      const restaurantId = req.restaurant.id

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: restaurantId },
        select: {
          id: true,
          name: true,
          description: true,
          phone: true,
          address: true,
          googleMapsUrl: true,
          logoUrl: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Restaurante no encontrado'
          }
        })
      }

      res.json({
        success: true,
        data: restaurant
      })
    } catch (error) {
      console.error('Error getting restaurant:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor'
        }
      })
    }
  },

  async updateMyRestaurant(req, res) {
    try {
      const restaurantId = req.restaurant.id
      const { name, description, phone, address, googleMapsUrl } = req.body

      // Validaciones básicas
      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'El nombre del restaurante debe tener al menos 2 caracteres'
          }
        })
      }

      const restaurant = await prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          phone: phone?.trim() || null,
          address: address?.trim() || null,
          googleMapsUrl: googleMapsUrl?.trim() || null,
        }
      })

      res.json({
        success: true,
        data: {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          phone: restaurant.phone,
          address: restaurant.address,
          googleMapsUrl: restaurant.googleMapsUrl,
          logoUrl: restaurant.logoUrl,
          createdAt: restaurant.createdAt,
          updatedAt: restaurant.updatedAt,
        }
      })
    } catch (error) {
      console.error('Error updating restaurant:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor'
        }
      })
    }
  },

  async getMySettings(req, res) {
    try {
      const restaurantId = req.restaurant.id

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: restaurantId },
        select: {
          id: true,
          settings: true,
          primaryColor: true,
          secondaryColor: true,
        }
      })

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Restaurante no encontrado'
          }
        })
      }

      // Configuración por defecto
      const defaultSettings = {
        showPrices: true,
        showImages: true,
        primaryColor: restaurant.primaryColor || '#0ea5e9',
        secondaryColor: restaurant.secondaryColor || '#f59e0b',
        primaryLanguage: 'es',
        multiLanguage: false,
        emailNotifications: true,
        analyticsNotifications: true,
      }

      let settings = defaultSettings

      // Intentar parsear settings si existe y es válido
      if (restaurant.settings) {
        try {
          // Verificar si es "[object Object]" y limpiarlo
          if (restaurant.settings === '[object Object]') {
            // Limpiar el campo corrupto
            await prisma.restaurant.update({
              where: { id: restaurantId },
              data: { settings: null }
            })
          } else {
            const parsedSettings = JSON.parse(restaurant.settings)
            settings = { ...defaultSettings, ...parsedSettings }
          }
        } catch (parseError) {
          console.log('Error parsing settings, using defaults:', parseError.message)
          // Limpiar el campo corrupto
          await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { settings: null }
          })
        }
      }

      // Asegurar que los colores de las columnas específicas tengan prioridad
      settings.primaryColor = restaurant.primaryColor || settings.primaryColor
      settings.secondaryColor = restaurant.secondaryColor || settings.secondaryColor

      console.log('🎨 Settings cargados:', {
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor
      })

      res.json({
        success: true,
        data: settings
      })
    } catch (error) {
      console.error('Error getting settings:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor'
        }
      })
    }
  },

  async updateMySettings(req, res) {
    try {
      const restaurantId = req.restaurant.id
      const settings = req.body

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: restaurantId }
      })

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Restaurante no encontrado'
          }
        })
      }

      // Validar que settings sea un objeto válido
      if (typeof settings !== 'object' || settings === null) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Configuración inválida'
          }
        })
      }

      console.log('🔧 Guardando settings para restaurante ID:', restaurantId)
      console.log('📝 Settings a guardar:', settings)

      // Separar los colores de los otros settings
      const { primaryColor, secondaryColor, ...otherSettings } = settings

      // Preparar datos para actualizar
      const updateData = {
        settings: JSON.stringify(otherSettings)
      }

      // Agregar colores si están presentes
      if (primaryColor) {
        updateData.primaryColor = primaryColor
      }
      if (secondaryColor) {
        updateData.secondaryColor = secondaryColor
      }

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: updateData
      })

      console.log('✅ Settings guardados correctamente')
      console.log('🎨 Colores actualizados:', { primaryColor, secondaryColor })

      res.json({
        success: true,
        data: settings
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor'
        }
      })
    }
  },

  async getMySocialMedia(req, res) {
    try {
      const restaurantId = req.restaurant.id

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: restaurantId },
        select: {
          id: true,
          socialMedia: true
        }
      })

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Restaurante no encontrado'
          }
        })
      }

      // Configuración por defecto de redes sociales
      const defaultSocialMedia = {
        instagram: { url: '', isActive: false },
        facebook: { url: '', isActive: false },
        tripadvisor: { url: '', isActive: false },
        tiktok: { url: '', isActive: false }
      }

      let socialMedia = defaultSocialMedia

      // Intentar parsear socialMedia si existe y es válido
      if (restaurant.socialMedia) {
        try {
          const parsedSocialMedia = JSON.parse(restaurant.socialMedia)
          socialMedia = { ...defaultSocialMedia, ...parsedSocialMedia }
        } catch (parseError) {
          console.log('Error parsing social media, using defaults:', parseError.message)
          // Limpiar el campo corrupto
          await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { socialMedia: null }
          })
        }
      }

      res.json({
        success: true,
        data: socialMedia
      })
    } catch (error) {
      console.error('Error getting social media:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor'
        }
      })
    }
  },

  async updateMySocialMedia(req, res) {
    try {
      const restaurantId = req.restaurant.id
      const socialMedia = req.body

      const restaurant = await prisma.restaurant.findFirst({
        where: { id: restaurantId }
      })

      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Restaurante no encontrado'
          }
        })
      }

      // Validar que socialMedia sea un objeto válido
      if (typeof socialMedia !== 'object' || socialMedia === null) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Configuración de redes sociales inválida'
          }
        })
      }

      // Validar estructura de redes sociales
      const validPlatforms = ['instagram', 'facebook', 'tripadvisor', 'tiktok']
      const validatedSocialMedia = {}

      for (const platform of validPlatforms) {
        if (socialMedia[platform]) {
          validatedSocialMedia[platform] = {
            url: socialMedia[platform].url || '',
            isActive: socialMedia[platform].isActive || false
          }
        } else {
          validatedSocialMedia[platform] = { url: '', isActive: false }
        }
      }

      console.log('🔗 Guardando redes sociales para restaurante ID:', restaurantId)
      console.log('📱 Redes sociales a guardar:', validatedSocialMedia)

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: {
          socialMedia: JSON.stringify(validatedSocialMedia)
        }
      })

      console.log('✅ Redes sociales guardadas correctamente')

      res.json({
        success: true,
        data: validatedSocialMedia
      })
    } catch (error) {
      console.error('Error updating social media:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Error interno del servidor'
        }
      })
    }
  }
}

module.exports = restaurantController 