const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const { errorResponse, successResponse, generateSlug, isValidEmail, isValidPassword } = require('../utils/helpers');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../utils/constants');

// Registro de restaurante
const register = async (req, res) => {
  try {
    const { name, restaurantName, email, password, phone, address, description } = req.body;

    // Validaciones
    if (!name || !restaurantName || !email || !password) {
      return res.status(400).json(errorResponse('Nombre, nombre del restaurante, email y contraseña son requeridos'));
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(errorResponse('Email inválido'));
    }

    if (!isValidPassword(password)) {
      return res.status(400).json(errorResponse('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'));
    }

    // Verificar si el email ya existe
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { email }
    });

    if (existingRestaurant) {
      return res.status(400).json(errorResponse(ERROR_MESSAGES.EMAIL_EXISTS));
    }

    // Generar slug único basado en el nombre del restaurante
    const slug = generateSlug(restaurantName);

    // Encriptar contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario primero
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Crear restaurante conectado al usuario
    const restaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName, // Usar el nombre del restaurante, no el del propietario
        email,
        password: hashedPassword,
        slug,
        phone,
        address,
        description,
        planType: 'FREE',
        isActive: true,
        userId: user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        phone: true,
        address: true,
        description: true,
        planType: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        createdAt: true
      }
    });

    // Generar token
    const token = generateToken(restaurant.id);

    res.status(201).json(successResponse({
      restaurant,
      token
    }, SUCCESS_MESSAGES.RESTAURANT_CREATED, 201));

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return res.status(400).json(errorResponse(ERROR_MESSAGES.SLUG_EXISTS));
    }
    
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Login de restaurante
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json(errorResponse('Email y contraseña son requeridos'));
    }

    // Buscar usuario primero
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true
      }
    });

    if (!user) {
      return res.status(401).json(errorResponse(ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
    }

    // Buscar restaurante asociado al usuario
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        slug: true,
        phone: true,
        address: true,
        description: true,
        isActive: true,
        planType: true,
        planExpiresAt: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        createdAt: true
      }
    });

    if (!restaurant) {
      return res.status(401).json(errorResponse(ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
    }

    if (!restaurant.isActive) {
      return res.status(403).json(errorResponse('Restaurante inactivo', 403));
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json(errorResponse(ERROR_MESSAGES.INVALID_CREDENTIALS, 401));
    }

    // Remover contraseña del objeto
    const { password: _, ...restaurantWithoutPassword } = restaurant;

    // Generar token
    const token = generateToken(restaurant.id);

    res.json(successResponse({
      restaurant: restaurantWithoutPassword,
      token
    }, SUCCESS_MESSAGES.LOGIN_SUCCESS));

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Obtener perfil del restaurante
const getProfile = async (req, res) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.restaurant.id },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        phone: true,
        address: true,
        description: true,
        logoUrl: true,
        website: true,
        isActive: true,
        planType: true,
        planExpiresAt: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        createdAt: true,
        updatedAt: true,
        settings: true
      }
    });

    if (!restaurant) {
      return res.status(404).json(errorResponse(ERROR_MESSAGES.NOT_FOUND, 404));
    }

    res.json(successResponse(restaurant));

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Actualizar perfil del restaurante
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, description, website } = req.body;

    // Validaciones
    if (name && name.trim().length < 2) {
      return res.status(400).json(errorResponse('El nombre debe tener al menos 2 caracteres'));
    }

    // Actualizar restaurante
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: req.restaurant.id },
      data: {
        name: name?.trim(),
        phone,
        address,
        description,
        website
      },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        phone: true,
        address: true,
        description: true,
        logoUrl: true,
        website: true,
        planType: true,
        theme: true,
        primaryColor: true,
        secondaryColor: true,
        fontFamily: true,
        updatedAt: true
      }
    });

    res.json(successResponse(updatedRestaurant, SUCCESS_MESSAGES.RESTAURANT_UPDATED));

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Cambiar contraseña
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validaciones
    if (!currentPassword || !newPassword) {
      return res.status(400).json(errorResponse('Contraseña actual y nueva contraseña son requeridas'));
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json(errorResponse('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'));
    }

    // Obtener restaurante con contraseña
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: req.restaurant.id },
      select: { password: true }
    });

    // Verificar contraseña actual
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, restaurant.password);
    if (!isValidCurrentPassword) {
      return res.status(400).json(errorResponse('Contraseña actual incorrecta'));
    }

    // Encriptar nueva contraseña
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await prisma.restaurant.update({
      where: { id: req.restaurant.id },
      data: { password: hashedNewPassword }
    });

    res.json(successResponse(null, SUCCESS_MESSAGES.PASSWORD_UPDATED));

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

// Logout (opcional, para invalidar tokens)
const logout = async (req, res) => {
  try {
    // En una implementación más avanzada, podrías invalidar el token
    // agregándolo a una lista negra en Redis
    
    res.json(successResponse(null, SUCCESS_MESSAGES.LOGOUT_SUCCESS));
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json(errorResponse(ERROR_MESSAGES.INTERNAL_ERROR, 500));
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
}; 