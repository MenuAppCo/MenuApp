const { prisma } = require('../config/database');
const ImageService = require('../services/imageService');
const { errorResponse, successResponse } = require('../utils/helpers');
const { ERROR_MESSAGES } = require('../utils/constants');

// Subir imagen de producto
const uploadProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { uploadedFile } = req;

    // Verificar que el producto existe y pertenece al restaurante
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(productId),
        restaurantId: req.restaurant.id
      }
    });

    if (!product) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Validar imagen
    await ImageService.validateImage(uploadedFile.path);

    // Procesar imagen
    const processedImage = await ImageService.processImage(uploadedFile.path, {
      width: 800,
      height: 800,
      quality: 80,
      format: 'webp'
    });

    // Crear múltiples tamaños
    const imageSizes = await ImageService.createImageSizes(processedImage.processedPath);

    // Actualizar producto con la nueva imagen
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(productId)
      },
      data: {
        imageUrl: processedImage.url
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

    res.json(successResponse({
      product: updatedProduct,
      image: {
        url: processedImage.url,
        sizes: imageSizes,
        metadata: processedImage.metadata
      }
    }, 'Imagen de producto subida exitosamente'));

  } catch (error) {
    console.error('Error subiendo imagen de producto:', error);
    res.status(500).json(errorResponse(error.message || ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Subir imagen de categoría
const uploadCategoryImage = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { uploadedFile } = req;

    // Verificar que la categoría existe y pertenece al restaurante
    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(categoryId),
        restaurantId: req.restaurant.id
      }
    });

    if (!category) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Validar imagen
    await ImageService.validateImage(uploadedFile.path);

    // Procesar imagen
    const processedImage = await ImageService.processImage(uploadedFile.path, {
      width: 600,
      height: 400,
      quality: 80,
      format: 'webp'
    });

    // Crear múltiples tamaños
    const imageSizes = await ImageService.createImageSizes(processedImage.processedPath);

    // Actualizar categoría con la nueva imagen
    const updatedCategory = await prisma.category.update({
      where: {
        id: parseInt(categoryId)
      },
      data: {
        imageUrl: processedImage.url
      }
    });

    res.json(successResponse({
      category: updatedCategory,
      image: {
        url: processedImage.url,
        sizes: imageSizes,
        metadata: processedImage.metadata
      }
    }, 'Imagen de categoría subida exitosamente'));

  } catch (error) {
    console.error('Error subiendo imagen de categoría:', error);
    res.status(500).json(errorResponse(error.message || ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Subir logo del restaurante
const uploadRestaurantLogo = async (req, res) => {
  try {
    const { uploadedFile } = req;

    // Validar imagen
    await ImageService.validateImage(uploadedFile.path);

    // Procesar imagen (logo más pequeño)
    const processedImage = await ImageService.processImage(uploadedFile.path, {
      width: 300,
      height: 300,
      quality: 90,
      format: 'webp'
    });

    // Crear múltiples tamaños
    const imageSizes = await ImageService.createImageSizes(processedImage.processedPath);

    // Actualizar restaurante con el nuevo logo
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id: req.restaurant.id
      },
      data: {
        logoUrl: processedImage.url
      },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        logoUrl: true,
        planType: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true
      }
    });

    res.json(successResponse({
      restaurant: updatedRestaurant,
      image: {
        url: processedImage.url,
        sizes: imageSizes,
        metadata: processedImage.metadata
      }
    }, 'Logo del restaurante subido exitosamente'));

  } catch (error) {
    console.error('Error subiendo logo del restaurante:', error);
    res.status(500).json(errorResponse(error.message || ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Eliminar imagen
const deleteImage = async (req, res) => {
  try {
    const { type, id } = req.params;

    let entity;
    let updateData = {};

    // Determinar qué entidad actualizar
    switch (type) {
      case 'product':
        entity = await prisma.product.findFirst({
          where: {
            id: parseInt(id),
            restaurantId: req.restaurant.id
          }
        });
        if (entity) {
          updateData = { imageUrl: null };
        }
        break;

      case 'category':
        entity = await prisma.category.findFirst({
          where: {
            id: parseInt(id),
            restaurantId: req.restaurant.id
          }
        });
        if (entity) {
          updateData = { imageUrl: null };
        }
        break;

      case 'restaurant':
        entity = await prisma.restaurant.findUnique({
          where: { id: req.restaurant.id }
        });
        if (entity) {
          updateData = { logoUrl: null };
        }
        break;

      default:
        return res.status(400).json(errorResponse('Tipo de imagen no válido'));
    }

    if (!entity) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    // Eliminar archivo de imagen
    const imageUrl = entity.imageUrl || entity.logoUrl;
    if (imageUrl) {
      await ImageService.deleteImage(imageUrl);
    }

    // Actualizar entidad
    let updatedEntity;
    switch (type) {
      case 'product':
        updatedEntity = await prisma.product.update({
          where: { id: parseInt(id) },
          data: updateData
        });
        break;

      case 'category':
        updatedEntity = await prisma.category.update({
          where: { id: parseInt(id) },
          data: updateData
        });
        break;

      case 'restaurant':
        updatedEntity = await prisma.restaurant.update({
          where: { id: req.restaurant.id },
          data: updateData
        });
        break;
    }

    res.json(successResponse(updatedEntity, 'Imagen eliminada exitosamente'));

  } catch (error) {
    console.error('Error eliminando imagen:', error);
    res.status(500).json(errorResponse(error.message || ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

module.exports = {
  uploadProductImage,
  uploadCategoryImage,
  uploadRestaurantLogo,
  deleteImage
}; 