const { prisma } = require('../config/database');
const { errorResponse, successResponse, getPagination } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');

const getMenus = async (req, res) => {
  try {
    console.log('🔍 getMenus called, restaurant ID:', req.restaurant?.id);
    
    const { page = 1, limit = 10 } = req.query;
    const { offset, limit: limitNum } = getPagination(page, limit);
    const restaurantId = req.restaurant.id;

    console.log('📊 Querying menus for restaurant:', restaurantId);

    const menus = await prisma.menu.findMany({
      where: {
        restaurantId: restaurantId,
        isActive: true
      },
      orderBy: {
        order: 'asc'
      },
      skip: offset,
      take: limitNum
    });

    const total = await prisma.menu.count({
      where: {
        restaurantId: restaurantId,
        isActive: true
      }
    });

    console.log('✅ Found menus:', menus.length, 'Total:', total);

    const response = successResponse({
      data: menus,
      meta: {
        total,
        page: parseInt(page),
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });

    console.log('📤 Sending response:', response);
    res.json(response);

  } catch (error) {
    console.error('❌ Error obteniendo menús:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

const createMenu = async (req, res) => {
  try {
    const { name, description, type = 'FOOD' } = req.body;
    const restaurantId = req.restaurant.id;

    // Validaciones
    if (!name || name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre del menú debe tener al menos 2 caracteres'));
    }

    // Obtener el siguiente orden
    const lastMenu = await prisma.menu.findFirst({
      where: { restaurantId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastMenu?.order || 0) + 1;

    const menu = await prisma.menu.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        type,
        order: nextOrder,
        restaurantId
      }
    });

    res.status(201).json(successResponse(menu, 'Menú creado exitosamente', 201));

  } catch (error) {
    console.error('Error creando menú:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

const getMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    const menu = await prisma.menu.findFirst({
      where: {
        id: parseInt(menuId),
        restaurantId: req.restaurant.id,
        isActive: true
      },
      include: {
        categories: {
          where: { isVisible: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!menu) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    res.json(successResponse(menu));

  } catch (error) {
    console.error('Error obteniendo menú:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

const updateMenu = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { name, description, type, isActive, order } = req.body;

    // Verificar que el menú existe y pertenece al restaurante
    const existingMenu = await prisma.menu.findFirst({
      where: {
        id: parseInt(menuId),
        restaurantId: req.restaurant.id
      }
    });

    if (!existingMenu) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Validaciones
    if (name && name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre del menú debe tener al menos 2 caracteres'));
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: parseInt(menuId) },
      data: {
        name: name?.trim(),
        description: description?.trim(),
        type,
        isActive,
        order: order ? parseInt(order) : undefined
      }
    });

    res.json(successResponse(updatedMenu, 'Menú actualizado exitosamente'));

  } catch (error) {
    console.error('Error actualizando menú:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Eliminar un menú
const deleteMenu = async (req, res) => {
  try {
    const { menuId } = req.params;

    // Verificar que el menú existe y pertenece al restaurante
    const existingMenu = await prisma.menu.findFirst({
      where: {
        id: parseInt(menuId),
        restaurantId: req.restaurant.id
      },
      include: {
        categories: {
          include: {
            products: true
          }
        }
      }
    });

    if (!existingMenu) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Verificar si tiene categorías con productos
    const hasProducts = existingMenu.categories.some(category => category.products.length > 0);
    if (hasProducts) {
      return res.status(400).json(errorResponse('No se puede eliminar un menú que tiene productos'));
    }

    // Eliminar menú y sus categorías
    await prisma.menu.delete({
      where: { id: parseInt(menuId) }
    });

    res.json(successResponse(null, 'Menú eliminado exitosamente'));

  } catch (error) {
    console.error('Error eliminando menú:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Reordenar menús
const reorderMenus = async (req, res) => {
  try {
    const { menuIds } = req.body;

    if (!Array.isArray(menuIds) || menuIds.length === 0) {
      return res.status(400).json(errorResponse('Se requiere un array de IDs de menús'));
    }

    // Actualizar el orden de cada menú
    const updatePromises = menuIds.map((menuId, index) => 
      prisma.menu.updateMany({
        where: {
          id: parseInt(menuId),
          restaurantId: req.restaurant.id
        },
        data: { order: index + 1 }
      })
    );

    await Promise.all(updatePromises);

    res.json(successResponse(null, 'Orden de menús actualizado exitosamente'));

  } catch (error) {
    console.error('Error reordenando menús:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

module.exports = {
  getMenus,
  createMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  reorderMenus
}; 