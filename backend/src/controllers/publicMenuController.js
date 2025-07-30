const { prisma } = require('../config/database');
const { errorResponse, successResponse, getDeviceInfo, getClientIP, getBrowserLanguage } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');

// Obtener menú público por slug del restaurante y tipo de menú
const getPublicMenu = async (req, res) => {
  try {
    const { slug, menuType = 'food' } = req.params;
    const userAgent = req.headers['user-agent'];
    const clientIP = getClientIP(req);
    const language = getBrowserLanguage(req);
    const deviceInfo = getDeviceInfo(userAgent);

    // Buscar restaurante por slug
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        website: true,
        phone: true,
        address: true,
        googleMapsUrl: true,
        showPrices: true,
        isActive: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        planType: true,
        socialMedia: true,
        settings: true
      }
    });

    if (!restaurant) {
      return res.status(404).json(errorResponse('Restaurante no encontrado', 404));
    }

    if (!restaurant.isActive) {
      return res.status(404).json(errorResponse('Restaurante no disponible', 404));
    }

    // Buscar el menú por tipo
    let menu = await prisma.menu.findFirst({
      where: {
        restaurantId: restaurant.id,
        type: menuType.toUpperCase(),
        isActive: true
      }
    });

    // Si no encuentra el menú específico, buscar el primer menú activo
    if (!menu) {
      menu = await prisma.menu.findFirst({
        where: {
          restaurantId: restaurant.id,
          isActive: true
        },
        orderBy: { order: 'asc' }
      });
    }

    if (!menu) {
      return res.status(404).json(errorResponse('No hay menús disponibles', 404));
    }

    // Obtener categorías visibles con productos del menú específico
    const categories = await prisma.category.findMany({
      where: {
        restaurantId: restaurant.id,
        menuId: menu.id,
        isVisible: true
      },
      include: {
        products: {
          where: {
            visible: true
          },
          orderBy: {
            name: 'asc'
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    // Filtrar categorías que tengan productos
    const categoriesWithProducts = categories.filter(category => category.products.length > 0);

    // Registrar analytics (en background)
    try {
      await prisma.analytics.create({
        data: {
          restaurantId: restaurant.id,
          pageViews: 1,
          uniqueVisitors: 1,
          userAgent,
          ipAddress: clientIP,
          deviceType: deviceInfo.type,
          date: new Date()
        }
      });
    } catch (analyticsError) {
      console.error('Error registrando analytics:', analyticsError);
      // No fallar la respuesta por errores de analytics
    }

    // Parsear redes sociales
    let socialMedia = {}
    if (restaurant.socialMedia) {
      try {
        socialMedia = JSON.parse(restaurant.socialMedia)
      } catch (error) {
        console.error('Error parsing social media:', error)
      }
    }

    // Preparar respuesta según idioma
    const menuData = {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        logoUrl: restaurant.logoUrl,
        website: restaurant.website,
        phone: restaurant.phone,
        address: restaurant.address,
        googleMapsUrl: restaurant.googleMapsUrl,
        showPrices: restaurant.showPrices,
        theme: restaurant.theme,
        primaryColor: restaurant.primaryColor,
        secondaryColor: restaurant.secondaryColor,
        fontFamily: restaurant.fontFamily,
        socialMedia: socialMedia,
        settings: restaurant.settings ? JSON.parse(restaurant.settings) : {}
      },
      menu: {
        id: menu.id,
        name: language === 'EN' && menu.nameEn ? menu.nameEn : menu.name,
        description: language === 'EN' && menu.descriptionEn ? menu.descriptionEn : menu.description,
        type: menu.type
      },
      categories: categoriesWithProducts.map(category => ({
        id: category.id,
        name: language === 'EN' && category.nameEn ? category.nameEn : category.name,
        description: language === 'EN' && category.descriptionEn ? category.descriptionEn : category.description,
        imageUrl: category.imageUrl,
        products: category.products.map(product => ({
          id: product.id,
          name: language === 'EN' && product.nameEn ? product.nameEn : product.name,
          description: language === 'EN' && product.descriptionEn ? product.descriptionEn : product.description,
          price: restaurant.showPrices ? product.price : null,
          currency: product.currency,
          imageUrl: product.imageUrl,
          imageVisible: product.imageVisible,
          featured: product.featured
        }))
      }))
    };

    res.json(successResponse(menuData));

  } catch (error) {
    console.error('Error obteniendo menú público:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Obtener información básica del restaurante para QR
const getRestaurantInfo = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        website: true,
        phone: true,
        address: true,
        googleMapsUrl: true,
        isActive: true,
        socialMedia: true,
        settings: true
      }
    });

    if (!restaurant) {
      return res.status(404).json(errorResponse('Restaurante no encontrado', 404));
    }

    if (!restaurant.isActive) {
      return res.status(404).json(errorResponse('Restaurante no disponible', 404));
    }

    // Parsear redes sociales
    let socialMedia = {}
    if (restaurant.socialMedia) {
      try {
        socialMedia = JSON.parse(restaurant.socialMedia)
        console.log('🔍 Backend - Social Media parsed:', socialMedia)
      } catch (error) {
        console.error('Error parsing social media:', error)
      }
    } else {
      console.log('🔍 Backend - No socialMedia field in restaurant')
    }

    const restaurantData = {
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        logoUrl: restaurant.logoUrl,
        website: restaurant.website,
        phone: restaurant.phone,
        address: restaurant.address,
        googleMapsUrl: restaurant.googleMapsUrl,
        socialMedia: socialMedia,
        settings: restaurant.settings ? JSON.parse(restaurant.settings) : {}
      }
    };

    console.log('🔍 Backend - Sending restaurant data:', restaurantData)
    res.json(successResponse(restaurantData));

  } catch (error) {
    console.error('Error obteniendo información del restaurante:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Obtener menús disponibles del restaurante
const getRestaurantMenus = async (req, res) => {
  try {
    const { slug } = req.params;
    const language = getBrowserLanguage(req);

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        logoUrl: true,
        isActive: true,
        socialMedia: true
      }
    });

    if (!restaurant) {
      return res.status(404).json(errorResponse('Restaurante no encontrado', 404));
    }

    if (!restaurant.isActive) {
      return res.status(404).json(errorResponse('Restaurante no disponible', 404));
    }

    // Parsear redes sociales
    let socialMedia = {}
    if (restaurant.socialMedia) {
      try {
        socialMedia = JSON.parse(restaurant.socialMedia)
      } catch (error) {
        console.error('Error parsing social media:', error)
      }
    }

    // Obtener menús activos con estadísticas
    const menus = await prisma.menu.findMany({
      where: {
        restaurantId: restaurant.id,
        isActive: true
      },
      include: {
        categories: {
          where: {
            isVisible: true
          },
          include: {
            _count: {
              select: {
                products: {
                  where: {
                    visible: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    const menusData = menus.map(menu => {
      // Calcular estadísticas del menú
      const categoriesCount = menu.categories.length;
      const productsCount = menu.categories.reduce((total, category) => {
        return total + category._count.products;
      }, 0);

      return {
        id: menu.id,
        name: language === 'EN' && menu.nameEn ? menu.nameEn : menu.name,
        description: language === 'EN' && menu.descriptionEn ? menu.descriptionEn : menu.description,
        type: menu.type,
        order: menu.order,
        categoriesCount,
        productsCount,
        updatedAt: menu.updatedAt
      };
    });

    res.json(successResponse({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        logoUrl: restaurant.logoUrl,
        socialMedia: socialMedia
      },
      menus: menusData
    }));

  } catch (error) {
    console.error('Error obteniendo menús del restaurante:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

module.exports = {
  getPublicMenu,
  getRestaurantInfo,
  getRestaurantMenus
}; 