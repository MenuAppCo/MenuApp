const { prisma } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/helpers');

// Devuelve los 3 eventos más recientes de productos, categorías y menús creados o actualizados
const getRecentActivity = async (req, res) => {
  try {
    const restaurantId = req.restaurant.id;

    // Obtener todos los productos
    const products = await prisma.product.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    console.log('🟢 Productos recientes:', products);

    // Obtener todas las categorías
    const categories = await prisma.category.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    console.log('🔵 Categorías recientes:', categories);

    // Obtener todos los menús
    const menus = await prisma.menu.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      },
      orderBy: [
        { updatedAt: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    console.log('🟣 Menús recientes:', menus);

    // Unificar y marcar tipo de entidad y acción
    const events = [];
    products.forEach(p => {
      events.push({
        id: p.id,
        type: 'product',
        name: p.name,
        date: p.updatedAt > p.createdAt ? p.updatedAt : p.createdAt,
        action: p.updatedAt > p.createdAt ? 'actualizado' : 'creado'
      });
    });
    categories.forEach(c => {
      events.push({
        id: c.id,
        type: 'category',
        name: c.name,
        date: c.updatedAt > c.createdAt ? c.updatedAt : c.createdAt,
        action: c.updatedAt > c.createdAt ? 'actualizada' : 'creada'
      });
    });
    menus.forEach(m => {
      events.push({
        id: m.id,
        type: 'menu',
        name: m.name,
        date: m.updatedAt > m.createdAt ? m.updatedAt : m.createdAt,
        action: m.updatedAt > m.createdAt ? 'actualizado' : 'creado'
      });
    });

    // Ordenar por fecha descendente y limitar a 3
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('🟠 Todos los eventos ordenados:', events);
    const recent = events.slice(0, 3);
    console.log('🔴 Eventos enviados al frontend:', recent);

    res.json(successResponse(recent));
  } catch (error) {
    console.error('Error obteniendo actividad reciente:', error);
    res.status(500).json(errorResponse('Error obteniendo actividad reciente', 500));
  }
};

module.exports = { getRecentActivity }; 