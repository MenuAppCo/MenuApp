
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const syncUser = async (req, res) => {
  const { id, email, user_metadata } = req.user;

  if (!id || !email) {
    return res.status(400).json({ message: 'Token de usuario inválido.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (existingUser) {
      return res.status(200).json({ message: 'El usuario ya está sincronizado.' });
    }

    // ¡Comprobación de seguridad añadida!
    if (!user_metadata) {
      return res.status(400).json({ message: 'No se encontraron metadatos en el perfil. No se puede completar el registro.' });
    }

    const { name, restaurantName } = user_metadata;
    if (!name || !restaurantName) {
      return res.status(400).json({ message: 'Faltan metadatos para la sincronización.' });
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { id, email, name },
      });

      const baseSlug = restaurantName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const uniqueSlug = `${baseSlug}-${Date.now()}`;

      await tx.restaurant.create({
        data: { userId: user.id, name: restaurantName, slug: uniqueSlug },
      });
    });

    res.status(201).json({ message: 'Usuario y restaurante creados con éxito.' });
  } catch (error) {
    console.error('Error al sincronizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { syncUser };
