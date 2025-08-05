

const { createClient } = require('@supabase/supabase-js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const authMiddleware = async (req, res, next) => {
  console.log(`\n[Auth Middleware] Verificando token para la ruta: ${req.method} ${req.path}`);
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticación requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Validar el token con Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    // 2. Adjuntar el usuario de Supabase a la petición
    req.user = user;
    console.log(`[Auth Middleware] Usuario autenticado: ${user.email}`);

    // 3. Buscar el restaurante asociado en nuestra base de datos Prisma
    const restaurant = await prisma.restaurant.findFirst({
      where: { userId: user.id },
    });

    // Si la ruta no es para crear el perfil, un restaurante debe existir
    if (!restaurant && req.path !== '/me/profile') {
        // Esto es normal si el usuario acaba de registrarse
        console.log(`[Auth Middleware] Usuario ${user.email} autenticado pero sin perfil de restaurante.`);
    } else if (restaurant) {
        console.log(`[Auth Middleware] Restaurante encontrado: ${restaurant.name} (ID: ${restaurant.id})`);
        req.restaurant = restaurant; // Adjuntar el restaurante a la petición
    }

    next();
  } catch (err) {
    console.error('[Auth Middleware] Error interno del servidor:', err);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = authMiddleware;
