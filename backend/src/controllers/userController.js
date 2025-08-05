const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener el perfil del usuario actual
const getMyProfile = async (req, res) => {
  const userId = req.user.id;
  console.log(`\n[GET /users/me/profile] Buscando perfil para el usuario ID: ${userId}`);
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { restaurants: true }, // Asegurarse de incluir los restaurantes
    });

    if (!user) {
      console.log(`[GET /users/me/profile] ❌ Perfil no encontrado para el usuario ID: ${userId}. Se requiere completar registro.`);
      return res.status(404).json({ message: 'Perfil no encontrado. Se requiere completar el registro.' });
    }
    console.log(`[GET /users/me/profile] ✅ Perfil encontrado para el usuario ID: ${userId}.`);
    res.status(200).json(user);
  } catch (error) {
    console.error('[GET /users/me/profile] ❌ Error de servidor:', error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
};

// Crear el perfil del usuario actual
const createMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { email } = req.user;
  const { name, restaurantName } = req.body;
  console.log(`\n[POST /users/me/profile] Intentando crear perfil para el usuario ID: ${userId}`);
  console.log(`[POST /users/me/profile] Datos recibidos:`, { name, restaurantName });

  if (!name || !restaurantName) {
    console.log(`[POST /users/me/profile] ❌ Error: Faltan datos (nombre o nombre del restaurante).`);
    return res.status(400).json({ message: 'Nombre y nombre del restaurante son requeridos.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (existingUser) {
      console.log(`[POST /users/me/profile] ❌ Error: El perfil para el usuario ID: ${userId} ya existe.`);
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

    console.log(`[POST /users/me/profile] ✅ Perfil creado exitosamente para el usuario ID: ${userId}.`);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('[POST /users/me/profile] ❌ Error de servidor:', error);
    res.status(500).json({ message: 'Error al crear el perfil.' });
  }
};

module.exports = { getMyProfile, createMyProfile };