const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener el perfil del usuario actual
const getMyProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { restaurants: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'Perfil no encontrado. Se requiere completar el registro.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('[GET /users/me/profile] Error de servidor:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Crear el perfil del usuario actual
const createMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { email } = req.user;
  const { name, restaurantName } = req.body;

  if (!name || !restaurantName) {
    return res.status(400).json({ message: 'Nombre y nombre del restaurante son requeridos.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (existingUser) {
      return res.status(409).json({ message: 'Este perfil ya ha sido creado.' });
    }

    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        name,
        restaurants: {
          create: {
            name: restaurantName,
            slug: `${restaurantName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          },
        },
      },
      include: { restaurants: true },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('[POST /users/me/profile] Error de servidor:', error);
    res.status(500).json({ message: 'Error al crear el perfil.' });
  }
};

module.exports = { getMyProfile, createMyProfile };