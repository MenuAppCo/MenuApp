const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { UPLOAD } = require('../utils/constants');
const S3Service = require('./s3Service');
const LocalImageService = require('./localImageService');
const config = require('../config/environment');

class ImageService {
  // Procesar y optimizar imagen usando buffer
  static async processImageBuffer(buffer, options = {}) {
    try {
      const {
        width = 800,
        height = 800,
        quality = 80,
        format = 'webp',
        filename = 'image',
        type = 'general'
      } = options;

      console.log(`🖼️ Procesando imagen desde buffer: ${filename}`);
      
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      console.log(`📊 Metadatos de imagen:`, {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size
      });

      // Redimensionar manteniendo proporción
      const resizedImage = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Convertir a formato especificado
      let processedBuffer;
      switch (format) {
        case 'webp':
          processedBuffer = await resizedImage.webp({ 
            quality,
            effort: 6, // Mejor compresión
            nearLossless: false
          }).toBuffer();
          break;
        case 'jpeg':
        case 'jpg':
          processedBuffer = await resizedImage.jpeg({ 
            quality,
            progressive: true,
            mozjpeg: true
          }).toBuffer();
          break;
        case 'png':
          processedBuffer = await resizedImage.png({ 
            quality,
            progressive: true,
            compressionLevel: 9
          }).toBuffer();
          break;
        default:
          processedBuffer = await resizedImage.webp({ 
            quality,
            effort: 6
          }).toBuffer();
      }

      // Generar nombre único para el archivo
      const baseName = path.basename(filename, path.extname(filename));
      const processedFilename = `${baseName}-processed.${format}`;

      // Usar S3 en producción, local en desarrollo
      if (config.isProduction() && config.S3_BUCKET_NAME) {
        try {
          // Subir imagen procesada a S3
          const s3Result = await S3Service.uploadImage(
            processedBuffer, 
            type, 
            processedFilename, 
            `image/${format}`
          );

          console.log(`💾 Imagen procesada y subida a S3: ${s3Result.url}`);

          return {
            buffer: processedBuffer,
            url: s3Result.url,
            s3Key: s3Result.key,
            metadata: {
              width: metadata.width,
              height: metadata.height,
              format: metadata.format,
              size: metadata.size
            }
          };
        } catch (s3Error) {
          console.warn('⚠️ Error subiendo a S3, fallback a almacenamiento local:', s3Error.message);
        }
      }

      // Fallback a almacenamiento local
      const localResult = await LocalImageService.processImageBuffer(buffer, options);
      console.log(`💾 Imagen procesada y guardada localmente: ${localResult.url}`);

      return localResult;
    } catch (error) {
      console.error('❌ Error procesando imagen desde buffer:', error);
      console.error('🔧 Opciones:', options);
      throw new Error(`Error al procesar la imagen: ${error.message}`);
    }
  }

  // Crear múltiples tamaños de imagen desde buffer
  static async createImageSizesFromBuffer(buffer, filename, sizes = UPLOAD.IMAGE_SIZES) {
    try {
      console.log(`🖼️ Creando múltiples tamaños desde buffer para: ${filename}`);
      
      const results = {};
      const baseName = path.basename(filename, path.extname(filename));

      // Usar Sharp con buffer
      const image = sharp(buffer);

      for (const [sizeName, dimensions] of Object.entries(sizes)) {
        console.log(`📏 Creando tamaño ${sizeName}: ${dimensions.width}x${dimensions.height}`);
        
        try {
          const sizeBuffer = await image
            .clone() // Clonar para evitar conflictos
            .resize(dimensions.width, dimensions.height, {
              fit: 'cover',
              position: 'center'
            })
            .webp({ 
              quality: 80,
              effort: 6,
              nearLossless: false
            })
            .toBuffer();

          results[sizeName] = {
            buffer: sizeBuffer,
            width: dimensions.width,
            height: dimensions.height
          };
          
          console.log(`✅ Tamaño ${sizeName} creado en memoria`);
        } catch (sizeError) {
          console.error(`❌ Error creando tamaño ${sizeName}:`, sizeError);
          // Continuar con otros tamaños
        }
      }

      // Usar S3 en producción, local en desarrollo
      if (config.isProduction() && config.S3_BUCKET_NAME) {
        try {
          // Subir todos los tamaños a S3
          const s3Results = await S3Service.uploadImageSizes(results, 'sizes', baseName);
          console.log(`🎉 Todos los tamaños creados y subidos a S3 exitosamente`);
          return s3Results;
        } catch (s3Error) {
          console.warn('⚠️ Error subiendo tamaños a S3, fallback a almacenamiento local:', s3Error.message);
        }
      }

      // Fallback a almacenamiento local
      const localResults = await LocalImageService.createImageSizesFromBuffer(buffer, filename, sizes);
      console.log(`🎉 Todos los tamaños creados localmente exitosamente`);
      return localResults;
    } catch (error) {
      console.error('❌ Error creando tamaños de imagen desde buffer:', error);
      throw new Error(`Error al crear tamaños de imagen: ${error.message}`);
    }
  }

  // Validar imagen desde buffer
  static async validateImageBuffer(buffer) {
    try {
      console.log(`🔍 Validando imagen desde buffer`);
      
      const metadata = await sharp(buffer).metadata();
      
      console.log(`📊 Metadatos de validación:`, {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha
      });
      
      // Verificar dimensiones mínimas
      if (metadata.width < 100 || metadata.height < 100) {
        throw new Error(`La imagen debe tener al menos 100x100 píxeles. Actual: ${metadata.width}x${metadata.height}`);
      }

      // Verificar formato
      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
      if (!allowedFormats.includes(metadata.format)) {
        throw new Error(`Formato de imagen no soportado: ${metadata.format}. Formatos permitidos: ${allowedFormats.join(', ')}`);
      }

      // Verificar que la imagen se puede leer correctamente
      await sharp(buffer).metadata();
      
      console.log(`✅ Imagen válida: ${metadata.format} ${metadata.width}x${metadata.height}`);
      return metadata;
    } catch (error) {
      console.error('❌ Error validando imagen desde buffer:', error);
      
      if (error.message.includes('Input buffer contains unsupported image format')) {
        throw new Error('Formato de imagen no soportado o archivo corrupto');
      }
      
      throw new Error(`Imagen inválida: ${error.message}`);
    }
  }

  // Procesar y optimizar imagen (método original para compatibilidad)
  static async processImage(filePath, options = {}) {
    try {
      const {
        width = 800,
        height = 800,
        quality = 80,
        format = 'webp'
      } = options;

      console.log(`🖼️ Procesando imagen: ${filePath}`);
      
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      console.log(`📊 Metadatos de imagen:`, {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size
      });

      // Redimensionar manteniendo proporción
      const resizedImage = image.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      });

      // Convertir a formato especificado
      let processedImage;
      switch (format) {
        case 'webp':
          processedImage = resizedImage.webp({ 
            quality,
            effort: 6, // Mejor compresión
            nearLossless: false
          });
          break;
        case 'jpeg':
        case 'jpg':
          processedImage = resizedImage.jpeg({ 
            quality,
            progressive: true,
            mozjpeg: true
          });
          break;
        case 'png':
          processedImage = resizedImage.png({ 
            quality,
            progressive: true,
            compressionLevel: 9
          });
          break;
        default:
          processedImage = resizedImage.webp({ 
            quality,
            effort: 6
          });
      }

      // Generar nombre del archivo procesado
      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);
      const processedPath = path.join(dir, `${baseName}-processed.${format}`);

      console.log(`💾 Guardando imagen procesada: ${processedPath}`);

      // Guardar imagen procesada
      await processedImage.toFile(processedPath);

      // Eliminar archivo original con manejo de errores
      try {
        // Pequeño delay para asegurar que Sharp haya liberado el archivo
        await new Promise(resolve => setTimeout(resolve, 100));
      await fs.unlink(filePath);
        console.log(`🗑️ Archivo original eliminado: ${filePath}`);
      } catch (unlinkError) {
        console.warn(`⚠️ No se pudo eliminar el archivo original: ${unlinkError.message}`);
        console.warn(`📁 Archivo: ${filePath}`);
        // No lanzar error, continuar con el proceso
      }

      return {
        originalPath: filePath,
        processedPath,
        url: processedPath.replace(/.*uploads/, '/uploads').replace(/\\/g, '/'),
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: metadata.size
        }
      };
    } catch (error) {
      console.error('❌ Error procesando imagen:', error);
      console.error('📁 Archivo:', filePath);
      console.error('🔧 Opciones:', options);
      throw new Error(`Error al procesar la imagen: ${error.message}`);
    }
  }

  // Crear múltiples tamaños de imagen (método original para compatibilidad)
  static async createImageSizes(filePath, sizes = UPLOAD.IMAGE_SIZES) {
    try {
      console.log(`🖼️ Creando múltiples tamaños para: ${filePath}`);
      
      const results = {};
      const dir = path.dirname(filePath);
      const ext = path.extname(filePath);
      const baseName = path.basename(filePath, ext);

      // Usar Sharp con mejor manejo de memoria
      const image = sharp(filePath);

      for (const [sizeName, dimensions] of Object.entries(sizes)) {
        const sizePath = path.join(dir, `${baseName}-${sizeName}.webp`);
        
        console.log(`📏 Creando tamaño ${sizeName}: ${dimensions.width}x${dimensions.height}`);
        
        try {
          await image
            .clone() // Clonar para evitar conflictos
          .resize(dimensions.width, dimensions.height, {
            fit: 'cover',
            position: 'center'
          })
            .webp({ 
              quality: 80,
              effort: 6,
              nearLossless: false
            })
          .toFile(sizePath);

        results[sizeName] = {
          path: sizePath,
          url: sizePath.replace(/.*uploads/, '/uploads').replace(/\\/g, '/'),
          width: dimensions.width,
          height: dimensions.height
        };
          
          console.log(`✅ Tamaño ${sizeName} creado: ${sizePath}`);
        } catch (sizeError) {
          console.error(`❌ Error creando tamaño ${sizeName}:`, sizeError);
          // Continuar con otros tamaños
        }
      }

      console.log(`🎉 Todos los tamaños creados exitosamente`);
      return results;
    } catch (error) {
      console.error('❌ Error creando tamaños de imagen:', error);
      console.error('📁 Archivo:', filePath);
      throw new Error(`Error al crear tamaños de imagen: ${error.message}`);
    }
  }

  // Eliminar imagen y sus variantes
  static async deleteImage(imageUrl) {
    try {
      if (!imageUrl) return;

      // Si es una URL de S3, extraer la key y eliminar de S3
      if (imageUrl.includes('s3.amazonaws.com')) {
        const urlParts = imageUrl.split('.com/');
        if (urlParts.length > 1) {
          const key = urlParts[1];
          await S3Service.deleteImageAndVariants('general', key.split('/').pop());
          console.log('Imagen eliminada exitosamente de S3:', key);
          return;
        }
      }

      // Para URLs locales (compatibilidad hacia atrás)
      if (imageUrl.startsWith('/uploads')) {
        console.log('⚠️ URL local detectada, eliminando archivos locales:', imageUrl);
        
        // Convertir URL a path
        const imagePath = imageUrl.replace('/uploads', path.join(__dirname, '../../uploads'));
        
        // Verificar si el archivo existe
        try {
          await fs.access(imagePath);
        } catch {
          console.log('Archivo local no encontrado:', imagePath);
          return;
        }

        // Obtener información del archivo
        const dir = path.dirname(imagePath);
        const ext = path.extname(imagePath);
        const baseName = path.basename(imagePath, ext);

        // Eliminar archivo principal
        await fs.unlink(imagePath);

        // Buscar y eliminar variantes
        const files = await fs.readdir(dir);
        const variants = files.filter(file => 
          file.startsWith(baseName) && file !== path.basename(imagePath)
        );

        for (const variant of variants) {
          const variantPath = path.join(dir, variant);
          try {
            await fs.unlink(variantPath);
          } catch (error) {
            console.log('Error eliminando variante local:', variantPath, error.message);
          }
        }

        console.log('Imagen local eliminada exitosamente:', imagePath);
      }
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  // Validar imagen (método original para compatibilidad)
  static async validateImage(filePath) {
    try {
      console.log(`🔍 Validando imagen: ${filePath}`);
      
      const metadata = await sharp(filePath).metadata();
      
      console.log(`📊 Metadatos de validación:`, {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        channels: metadata.channels,
        hasAlpha: metadata.hasAlpha
      });
      
      // Verificar dimensiones mínimas
      if (metadata.width < 100 || metadata.height < 100) {
        throw new Error(`La imagen debe tener al menos 100x100 píxeles. Actual: ${metadata.width}x${metadata.height}`);
      }

      // Verificar formato
      const allowedFormats = ['jpeg', 'jpg', 'png', 'webp'];
      if (!allowedFormats.includes(metadata.format)) {
        throw new Error(`Formato de imagen no soportado: ${metadata.format}. Formatos permitidos: ${allowedFormats.join(', ')}`);
      }

      // Verificar que la imagen se puede leer correctamente
      await sharp(filePath).metadata();
      
      console.log(`✅ Imagen válida: ${metadata.format} ${metadata.width}x${metadata.height}`);
      return metadata;
    } catch (error) {
      console.error('❌ Error validando imagen:', error);
      console.error('📁 Archivo:', filePath);
      
      if (error.message.includes('Input buffer contains unsupported image format')) {
        throw new Error('Formato de imagen no soportado o archivo corrupto');
      }
      
      throw new Error(`Imagen inválida: ${error.message}`);
    }
  }

  // Obtener URL de imagen optimizada
  static getOptimizedImageUrl(originalUrl, size = 'medium') {
    if (!originalUrl) return null;
    
    const ext = path.extname(originalUrl);
    const baseUrl = originalUrl.replace(ext, '');
    return `${baseUrl}-${size}.webp`;
  }

  // Limpiar archivos temporales huérfanos
  static async cleanupOrphanedFiles(uploadDir) {
    try {
      console.log(`🧹 Limpiando archivos huérfanos en: ${uploadDir}`);
      
      const files = await fs.readdir(uploadDir);
      const orphanedFiles = files.filter(file => {
        // Buscar archivos que no tengan el sufijo -processed
        return !file.includes('-processed') && 
               !file.includes('-thumbnail') && 
               !file.includes('-medium') && 
               !file.includes('-large') &&
               (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.webp'));
      });

      for (const file of orphanedFiles) {
        const filePath = path.join(uploadDir, file);
        try {
          // Verificar si el archivo tiene más de 1 hora
          const stats = await fs.stat(filePath);
          const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
          
          if (ageInHours > 1) {
            await fs.unlink(filePath);
            console.log(`🗑️ Archivo huérfano eliminado: ${file}`);
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo eliminar archivo huérfano ${file}:`, error.message);
        }
      }
      
      console.log(`✅ Limpieza completada. ${orphanedFiles.length} archivos revisados`);
    } catch (error) {
      console.error('❌ Error en limpieza de archivos:', error);
    }
  }
}

module.exports = ImageService; 