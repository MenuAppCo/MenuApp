const { prisma } = require('../config/database');
const { errorResponse, successResponse, getPagination, formatPrice } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');
const ImageService = require('../services/imageService');

// Obtener todos los productos del restaurante
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, categoryId, menuId, search } = req.query;
    const { offset, limit: take } = getPagination(page, limit);

    console.log('🔍 Buscando productos para restaurante ID:', req.restaurant.id);

    // Construir filtros
    const where = {
      restaurantId: req.restaurant.id
    };

    if (categoryId) {
      where.categoryId = parseInt(categoryId);
    }

    if (menuId) {
      where.category = {
        menuId: parseInt(menuId)
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nameEn: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            menu: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      skip: offset,
      take
    });

    const total = await prisma.product.count({ where });

    console.log('📊 Productos encontrados:', products.length);
    console.log('📈 Total de productos:', total);

    // Formatear precios
    const formattedProducts = products.map(product => ({
      ...product,
      formattedPrice: formatPrice(product.price, product.currency)
    }));

    res.json(successResponse({
      data: formattedProducts,
      meta: {
        page: parseInt(page),
        limit: take,
        total,
        pages: Math.ceil(total / take)
      }
    }));

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Obtener un producto específico
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Formatear precio
    const formattedProduct = {
      ...product,
      formattedPrice: formatPrice(product.price, product.currency)
    };

    res.json(successResponse(formattedProduct));

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Crear nuevo producto
const createProduct = async (req, res) => {
  try {
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      price,
      currency = 'USD',
      categoryId,
      visible = true,
      featured = false,
      imageVisible = true
    } = req.body;

    // Validaciones
    if (!name || name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre del producto debe tener al menos 2 caracteres'));
    }

    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json(errorResponse('El precio debe ser un número mayor a 0'));
    }

    if (!categoryId) {
      return res.status(400).json(errorResponse('La categoría es requerida'));
    }

    // Verificar que la categoría existe y pertenece al restaurante
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(categoryId),
        restaurantId: req.restaurant.id
      }
    });

    if (!category) {
      return res.status(400).json(errorResponse('La categoría especificada no existe'));
    }

    console.log('🏗️ Creando producto para restaurante ID:', req.restaurant.id);
    console.log('📝 Datos del producto:', { name, price, categoryId, visible, featured });

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        nameEn: nameEn?.trim(),
        description: description?.trim(),
        descriptionEn: descriptionEn?.trim(),
        price: parseFloat(price),
        currency,
        visible,
        featured,
        imageVisible,
        categoryId: parseInt(categoryId),
        restaurantId: req.restaurant.id
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        }
      }
    });

    console.log('✅ Producto creado con ID:', product.id);

    // Formatear precio
    const formattedProduct = {
      ...product,
      formattedPrice: formatPrice(product.price, product.currency)
    };

    res.status(201).json(successResponse(formattedProduct, 'Producto creado exitosamente', 201));

  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      price,
      currency,
      categoryId,
      visible,
      featured,
      imageVisible
    } = req.body;

    // Verificar que el producto existe y pertenece al restaurante
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      }
    });

    if (!existingProduct) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Validaciones
    if (name && name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre del producto debe tener al menos 2 caracteres'));
    }

    if (price && (isNaN(price) || price <= 0)) {
      return res.status(400).json(errorResponse('El precio debe ser un número mayor a 0'));
    }

    // Verificar categoría si se está cambiando
    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: parseInt(categoryId),
          restaurantId: req.restaurant.id
        }
      });

      if (!category) {
        return res.status(400).json(errorResponse('La categoría especificada no existe'));
      }
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name?.trim(),
        nameEn: nameEn?.trim(),
        description: description?.trim(),
        descriptionEn: descriptionEn?.trim(),
        price: price ? parseFloat(price) : undefined,
        currency,
        visible,
        featured,
        imageVisible,
        categoryId: categoryId ? parseInt(categoryId) : undefined
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            nameEn: true
          }
        }
      }
    });

    // Formatear precio
    const formattedProduct = {
      ...updatedProduct,
      formattedPrice: formatPrice(updatedProduct.price, updatedProduct.currency)
    };

    res.json(successResponse(formattedProduct, 'Producto actualizado exitosamente'));

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe y pertenece al restaurante
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      }
    });

    if (!product) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Eliminar imagen si existe
    if (product.imageUrl) {
      try {
        await ImageService.deleteImage(product.imageUrl);
      } catch (error) {
        console.error('Error eliminando imagen del producto:', error);
      }
    }

    await prisma.product.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.json(successResponse(null, 'Producto eliminado exitosamente'));

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Cambiar visibilidad de producto
const toggleProductVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      }
    });

    if (!product) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        visible: !product.visible
      }
    });

    res.json(successResponse(updatedProduct, `Producto ${updatedProduct.visible ? 'visible' : 'oculto'} exitosamente`));

  } catch (error) {
    console.error('Error cambiando visibilidad del producto:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Cambiar estado destacado del producto
const toggleProductFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        restaurantId: req.restaurant.id
      }
    });

    if (!product) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        featured: !product.featured
      }
    });

    res.json(successResponse(updatedProduct, `Producto ${updatedProduct.featured ? 'destacado' : 'no destacado'} exitosamente`));

  } catch (error) {
    console.error('Error cambiando estado destacado del producto:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility,
  toggleProductFeatured
}; 