#!/usr/bin/env node

/**
 * Script para migrar de SQLite a PostgreSQL
 * 
 * Este script:
 * 1. Resetea las migraciones para PostgreSQL
 * 2. Genera nuevas migraciones compatibles
 * 3. Proporciona instrucciones para Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando migración de SQLite a PostgreSQL...\n');

// Verificar que estamos en el directorio correcto
if (!fs.existsSync('prisma/schema.prisma')) {
  console.error('❌ Error: No se encontró el archivo schema.prisma');
  console.error('   Ejecuta este script desde el directorio backend/');
  process.exit(1);
}

try {
  // 1. Eliminar migraciones existentes de SQLite
  console.log('📁 Eliminando migraciones existentes de SQLite...');
  const migrationsDir = path.join('prisma', 'migrations');
  if (fs.existsSync(migrationsDir)) {
    fs.rmSync(migrationsDir, { recursive: true, force: true });
    console.log('✅ Migraciones eliminadas');
  }

  // 2. Eliminar base de datos SQLite si existe
  console.log('🗄️  Eliminando base de datos SQLite...');
  const sqliteDb = path.join('prisma', 'dev.db');
  if (fs.existsSync(sqliteDb)) {
    fs.unlinkSync(sqliteDb);
    console.log('✅ Base de datos SQLite eliminada');
  }

  // 3. Regenerar cliente Prisma
  console.log('🔧 Regenerando cliente Prisma...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  console.log('✅ Cliente Prisma regenerado');

  // 4. Crear nueva migración inicial para PostgreSQL
  console.log('📝 Creando migración inicial para PostgreSQL...');
  execSync('npm run migrate -- --name init', { stdio: 'inherit' });
  console.log('✅ Migración inicial creada');

  console.log('\n🎉 ¡Migración completada exitosamente!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Configura tu DATABASE_URL en el archivo .env');
  console.log('2. Para Supabase:');
  console.log('   - Ve a tu proyecto en Supabase');
  console.log('   - Copia la URL de conexión de la base de datos');
  console.log('   - Actualiza DATABASE_URL en .env');
  console.log('3. Ejecuta: npm run migrate:deploy');
  console.log('4. Ejecuta: npm run db:seed (opcional)');

} catch (error) {
  console.error('❌ Error durante la migración:', error.message);
  console.error('\n💡 Solución:');
  console.error('1. Asegúrate de que PostgreSQL esté instalado y ejecutándose');
  console.error('2. Verifica que tu DATABASE_URL sea correcta');
  console.error('3. Si usas Supabase, asegúrate de que la URL incluya el password');
  process.exit(1);
} 