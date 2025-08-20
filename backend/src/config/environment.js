// Configuración del entorno
const config = {
  // Entorno
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Base de datos
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  
  // Frontend URLs
  FRONTEND_URL: process.env.FRONTEND_URL,
  
  // AWS S3
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'production-menapp-images',
  
  // Validaciones
  isProduction: () => config.NODE_ENV === 'production',
  isDevelopment: () => config.NODE_ENV === 'development',
  isTest: () => config.NODE_ENV === 'test',
  
  // Validar configuración requerida
  validate: () => {
    const required = [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_KEY',
      'S3_BUCKET_NAME' // S3 es requerido para todas las operaciones de imagen
    ];
    
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
      throw new Error(`Configuración faltante: ${missing.join(', ')}`);
    }
    
    return true;
  }
};

// Validar configuración al cargar el módulo
try {
  config.validate();
  console.log('✅ Configuración del entorno validada correctamente');
  
  // Mostrar configuración S3
  console.log(`🌐 AWS S3 Config:`);
  console.log(`   - Region: ${config.AWS_REGION}`);
  console.log(`   - Bucket: ${config.S3_BUCKET_NAME}`);
  console.log(`   - Environment: ${config.NODE_ENV}`);
  
  if (config.isDevelopment()) {
    console.log(`   - Credentials: ${config.AWS_ACCESS_KEY_ID ? 'Configured' : 'Not configured (using local fallback)'}`);
  } else {
    console.log(`   - Credentials: Using IAM role (Lambda)`);
  }
  
} catch (error) {
  console.warn('⚠️ Advertencia de configuración:', error.message);
  
  if (config.isProduction()) {
    console.error('❌ Error crítico en producción');
    process.exit(1);
  }
}

module.exports = config;
