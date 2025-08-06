const { PrismaClient } = require('@prisma/client');

// this vars are reused on lambda executions, avoiding hitting pooling limit
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Base de datos conectada exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  }
}

// Función para desconectar de la base de datos
async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('✅ Base de datos desconectada');
  } catch (error) {
    console.error('❌ Error desconectando de la base de datos:', error);
  }
}

// Manejo de señales para cerrar conexión
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = {
  prisma,
  connectDB,
  disconnectDB
}; 