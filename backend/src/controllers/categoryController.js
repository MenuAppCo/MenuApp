const { prisma } = require('../config/database');
const { errorResponse, successResponse, getPagination } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');
const ImageService = require('../services/imageService');

// Obtener todas las categorías del restaurante
const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, menuId } = req.query;
    const { offset, limit: take } = getPagination(page, limit);

    const where = {
      restaurantId: req.restaurant.id
    };
    if (menuId) {
      where.menuId = parseInt(menuId);
    }

    console.log('🔍 Buscando categorías para restaurante ID:', req.restaurant.id);

    const categories = await prisma.category.findMany({
      where,
      orderBy: {
        order: 'asc'
      },
      skip: offset,
      take,
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        },
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    const total = await prisma.category.count({
      where
    });

    console.log('📊 Categorías encontradas:', categories.length);
    console.log('📈 Total de categorías:', total);
    console.log('🔍 Detalles de categorías:', categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      productCount: cat._count.products
    })));

    // Debug: Verificar productos directamente
    for (const category of categories) {
      const productsInCategory = await prisma.product.findMany({
        where: {
          categoryId: category.id,
          restaurantId: req.restaurant.id
        },
        select: {
          id: true,
          name: true
        }
      });
      console.log(`🔍 Productos en categoría ${category.name} (ID: ${category.id}):`, productsInCategory.length, productsInCategory);
    }

    res.json(successResponse({
      data: categories,
      meta: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    }));

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Obtener una categoría específica
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        },
        products: {
          where: {
            visible: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    res.json(successResponse(category));

  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Crear nueva categoría
const createCategory = async (req, res) => {
  try {
    const { name, nameEn, description, descriptionEn, order, isVisible = true, menuId } = req.body;

    // Validaciones
    if (!name || name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre de la categoría debe tener al menos 2 caracteres'));
    }

    // Si no se especifica menuId, buscar el primer menú disponible
    let targetMenuId = menuId;
    if (!targetMenuId) {
      const firstMenu = await prisma.menu.findFirst({
        where: { restaurantId: req.restaurant.id },
        orderBy: { order: 'asc' }
      });
      
      if (!firstMenu) {
        return res.status(400).json(errorResponse('Primero debes crear un menú'));
      }
      
      targetMenuId = firstMenu.id;
    } else {
      // Verificar que el menú existe y pertenece al restaurante
      const menu = await prisma.menu.findFirst({
        where: {
          id: parseInt(targetMenuId),
          restaurantId: req.restaurant.id
        }
      });

      if (!menu) {
        return res.status(400).json(errorResponse('Menú no válido'));
      }
    }

    // Obtener el siguiente orden si no se especifica
    let categoryOrder = order;
    if (!categoryOrder) {
      const lastCategory = await prisma.category.findFirst({
        where: { restaurantId: req.restaurant.id, menuId: parseInt(targetMenuId) },
        orderBy: { order: 'desc' }
      });
      categoryOrder = lastCategory ? lastCategory.order + 1 : 1;
    }

    console.log('🏗️ Creando categoría para restaurante ID:', req.restaurant.id);
    console.log('📝 Datos de la categoría:', { name, order: categoryOrder, isVisible, menuId });

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        nameEn: nameEn?.trim(),
        description: description?.trim(),
        descriptionEn: descriptionEn?.trim(),
        order: categoryOrder,
        isVisible,
        restaurantId: req.restaurant.id,
        menuId: parseInt(targetMenuId)
      }
    });

    console.log('✅ Categoría creada con ID:', category.id);

    res.status(201).json(successResponse(category, 'Categoría creada exitosamente', 201));

  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Actualizar categoría
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nameEn, description, descriptionEn, order, isVisible, menuId } = req.body;

    // Verificar que la categoría existe y pertenece al restaurante
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      }
    });

    if (!existingCategory) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Validaciones
    if (name && name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre de la categoría debe tener al menos 2 caracteres'));
    }

    // Verificar que el menú existe y pertenece al restaurante si se está cambiando
    if (menuId) {
      const menu = await prisma.menu.findFirst({
        where: {
          id: parseInt(menuId),
          restaurantId: req.restaurant.id
        }
      });

      if (!menu) {
        return res.status(400).json(errorResponse('Menú no válido'));
      }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name?.trim(),
        nameEn: nameEn?.trim(),
        description: description?.trim(),
        descriptionEn: descriptionEn?.trim(),
        order: order ? parseInt(order) : undefined,
        isVisible,
        menuId: menuId ? parseInt(menuId) : undefined
      }
    });

    res.json(successResponse(updatedCategory, 'Categoría actualizada exitosamente'));

  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Eliminar categoría
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la categoría existe y pertenece al restaurante
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!category) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    console.log(`🗑️ Eliminando categoría "${category.name}" con ${category._count.products} productos`);

    // Eliminar todos los productos de la categoría primero
    if (category._count.products > 0) {
      console.log(`📦 Eliminando ${category._count.products} productos de la categoría`);
      
      // Obtener todos los productos para eliminar sus imágenes
      const products = await prisma.product.findMany({
        where: {
          categoryId: parseInt(id),
          restaurantId: req.restaurant.id
        },
        select: {
          id: true,
          imageUrl: true
        }
      });

      // Eliminar imágenes de los productos
      for (const product of products) {
        if (product.imageUrl) {
          try {
            await ImageService.deleteImage(product.imageUrl);
            console.log(`🗑️ Imagen eliminada para producto ${product.id}`);
          } catch (error) {
            console.error(`Error eliminando imagen del producto ${product.id}:`, error);
          }
        }
      }

      // Eliminar todos los productos de la categoría
      await prisma.product.deleteMany({
        where: {
          categoryId: parseInt(id),
          restaurantId: req.restaurant.id
        }
      });

      console.log(`✅ ${category._count.products} productos eliminados`);
    }

    // Eliminar imagen de la categoría si existe
    if (category.imageUrl) {
      try {
        await ImageService.deleteImage(category.imageUrl);
        console.log('🗑️ Imagen de categoría eliminada');
      } catch (error) {
        console.error('Error eliminando imagen de la categoría:', error);
      }
    }

    // Eliminar la categoría
    await prisma.category.delete({
      where: {
        id: parseInt(id)
      }
    });

    console.log(`✅ Categoría "${category.name}" eliminada exitosamente`);

    const message = category._count.products > 0 
      ? `Categoría y ${category._count.products} productos eliminados exitosamente`
      : 'Categoría eliminada exitosamente';

    res.json(successResponse(null, message));

  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Reordenar categorías
const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json(errorResponse('Se requiere un array de categorías con sus IDs y órdenes'));
    }

    // Verificar que todas las categorías pertenecen al restaurante
    const categoryIds = categories.map(cat => parseInt(cat.id));
    const existingCategories = await prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        restaurantId: req.restaurant.id
      }
    });

    if (existingCategories.length !== categories.length) {
      return res.status(400).json(errorResponse('Algunas categorías no existen o no pertenecen a este restaurante'));
    }

    // Actualizar el orden de todas las categorías
    const updatePromises = categories.map(cat => 
      prisma.category.update({
        where: { id: parseInt(cat.id) },
        data: { order: parseInt(cat.order) }
      })
    );

    await Promise.all(updatePromises);

    res.json(successResponse(null, 'Orden de categorías actualizado exitosamente'));

  } catch (error) {
    console.error('Error reordenando categorías:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories
}; 