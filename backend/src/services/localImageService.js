const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { UPLOAD } = require('../utils/constants');

class LocalImageService {
  // Procesar y optimizar imagen usando buffer (guardar localmente)
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

      console.log(`🖼️ Procesando imagen localmente: ${filename}`);
      
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
            effort: 6,
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

      // Crear directorio de uploads si no existe
      const uploadDir = path.join(__dirname, '../../uploads', type);
      await fs.mkdir(uploadDir, { recursive: true });

      // Generar nombre del archivo procesado
      const baseName = path.basename(filename, path.extname(filename));
      const processedFilename = `${baseName}-processed.${format}`;
      const processedPath = path.join(uploadDir, processedFilename);

      // Guardar imagen procesada localmente
      await fs.writeFile(processedPath, processedBuffer);

      console.log(`💾 Imagen procesada y guardada localmente: ${processedPath}`);

      return {
        buffer: processedBuffer,
        url: `/uploads/${type}/${processedFilename}`,
        localPath: processedPath,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: metadata.size
        }
      };
    } catch (error) {
      console.error('❌ Error procesando imagen localmente:', error);
      throw new Error(`Error al procesar la imagen: ${error.message}`);
    }
  }

  // Crear múltiples tamaños de imagen localmente
  static async createImageSizesFromBuffer(buffer, filename, sizes = UPLOAD.IMAGE_SIZES) {
    try {
      console.log(`🖼️ Creando múltiples tamaños localmente para: ${filename}`);
      
      const results = {};
      const baseName = path.basename(filename, path.extname(filename));
      const uploadDir = path.join(__dirname, '../../uploads/sizes');
      
      // Crear directorio si no existe
      await fs.mkdir(uploadDir, { recursive: true });

      // Usar Sharp con buffer
      const image = sharp(buffer);

      for (const [sizeName, dimensions] of Object.entries(sizes)) {
        console.log(`📏 Creando tamaño ${sizeName}: ${dimensions.width}x${dimensions.height}`);
        
        try {
          const sizeBuffer = await image
            .clone()
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

          const sizeFilename = `${baseName}-${sizeName}.webp`;
          const sizePath = path.join(uploadDir, sizeFilename);
          
          // Guardar tamaño localmente
          await fs.writeFile(sizePath, sizeBuffer);

          results[sizeName] = {
            buffer: sizeBuffer,
            url: `/uploads/sizes/${sizeFilename}`,
            localPath: sizePath,
            width: dimensions.width,
            height: dimensions.height
          };
          
          console.log(`✅ Tamaño ${sizeName} creado localmente: ${sizePath}`);
        } catch (sizeError) {
          console.error(`❌ Error creando tamaño ${sizeName}:`, sizeError);
        }
      }

      console.log(`🎉 Todos los tamaños creados localmente exitosamente`);
      return results;
    } catch (error) {
      console.error('❌ Error creando tamaños de imagen localmente:', error);
      throw new Error(`Error al crear tamaños de imagen: ${error.message}`);
    }
  }

  // Eliminar imagen y sus variantes localmente
  static async deleteImage(imageUrl) {
    try {
      if (!imageUrl) return;

      if (imageUrl.startsWith('/uploads')) {
        const imagePath = imageUrl.replace('/uploads', path.join(__dirname, '../../uploads'));
        
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
      console.error('Error eliminando imagen local:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }
}

module.exports = LocalImageService;
