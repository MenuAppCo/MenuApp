const { PrismaClient } = require('@prisma/client');
const { generateSlug } = require('../src/utils/helpers');

const prisma = new PrismaClient();

async function fixRestaurantSlugs() {
  try {
    console.log('🔧 Iniciando corrección de slugs de restaurantes...');

    // Obtener todos los restaurantes
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    console.log(`📊 Encontrados ${restaurants.length} restaurantes`);

    for (const restaurant of restaurants) {
      // Verificar si el slug actual está basado en el nombre del usuario
      const currentSlug = restaurant.slug;
      const userNameSlug = generateSlug(restaurant.user.name);
      const restaurantNameSlug = generateSlug(restaurant.name);

      // Si el slug actual coincide con el slug del nombre de usuario, actualizarlo
      if (currentSlug.includes(userNameSlug.split('-')[0])) {
        console.log(`🔄 Actualizando slug para restaurante: ${restaurant.name}`);
        console.log(`   Slug anterior: ${currentSlug}`);
        console.log(`   Nuevo slug: ${restaurantNameSlug}`);

        try {
          await prisma.restaurant.update({
            where: { id: restaurant.id },
            data: { slug: restaurantNameSlug }
          });
          console.log(`   ✅ Slug actualizado exitosamente`);
        } catch (error) {
          if (error.code === 'P2002') {
            // Si hay conflicto de slug único, agregar timestamp
            const uniqueSlug = `${restaurantNameSlug}-${Date.now().toString(36)}`;
            console.log(`   ⚠️  Conflicto de slug, usando: ${uniqueSlug}`);
            
            await prisma.restaurant.update({
              where: { id: restaurant.id },
              data: { slug: uniqueSlug }
            });
            console.log(`   ✅ Slug único generado exitosamente`);
          } else {
            console.error(`   ❌ Error actualizando slug:`, error.message);
          }
        }
      } else {
        console.log(`✅ Slug correcto para: ${restaurant.name} (${currentSlug})`);
      }
    }

    console.log('🎉 Corrección de slugs completada');

  } catch (error) {
    console.error('❌ Error en la corrección de slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
fixRestaurantSlugs(); 