const { s3, S3_CONFIG, getS3Url, getS3Key } = require('../config/s3');

class S3Service {
  // Subir archivo a S3
  static async uploadFile(buffer, key, contentType, metadata = {}) {
    try {
      console.log(`📤 Subiendo archivo a S3: ${key}`);
      
      const params = {
        Bucket: S3_CONFIG.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: metadata,
        // Configurar cache para imágenes
        CacheControl: 'public, max-age=31536000', // 1 año
        // Configurar ACL privado (por defecto)
        ACL: 'private'
      };

      const result = await s3.upload(params).promise();
      
      console.log(`✅ Archivo subido exitosamente a S3: ${result.Location}`);
      
      return {
        key: result.Key,
        url: result.Location,
        etag: result.ETag,
        versionId: result.VersionId
      };
    } catch (error) {
      console.error('❌ Error subiendo archivo a S3:', error);
      throw new Error(`Error al subir archivo a S3: ${error.message}`);
    }
  }

  // Subir imagen procesada a S3
  static async uploadImage(buffer, type, filename, contentType = 'image/webp') {
    try {
      const key = getS3Key(type, filename);
      const metadata = {
        'original-filename': filename,
        'content-type': contentType,
        'upload-date': new Date().toISOString()
      };

      return await this.uploadFile(buffer, key, contentType, metadata);
    } catch (error) {
      console.error('❌ Error subiendo imagen a S3:', error);
      throw error;
    }
  }

  // Subir múltiples tamaños de imagen
  static async uploadImageSizes(imageBuffers, type, baseFilename) {
    try {
      console.log(`📤 Subiendo múltiples tamaños de imagen a S3: ${baseFilename}`);
      
      const results = {};
      
      for (const [sizeName, imageData] of Object.entries(imageBuffers)) {
        const filename = `${baseFilename}-${sizeName}.webp`;
        const key = getS3Key('sizes', filename);
        
        try {
          const result = await this.uploadFile(
            imageData.buffer, 
            key, 
            'image/webp',
            {
              'size-name': sizeName,
              'dimensions': `${imageData.width}x${imageData.height}`,
              'base-filename': baseFilename
            }
          );
          
          results[sizeName] = {
            ...imageData,
            s3Key: result.key,
            s3Url: result.url
          };
          
          console.log(`✅ Tamaño ${sizeName} subido a S3: ${result.url}`);
        } catch (sizeError) {
          console.error(`❌ Error subiendo tamaño ${sizeName}:`, sizeError);
          // Continuar con otros tamaños
        }
      }
      
      return results;
    } catch (error) {
      console.error('❌ Error subiendo tamaños de imagen a S3:', error);
      throw error;
    }
  }

  // Eliminar archivo de S3
  static async deleteFile(key) {
    try {
      console.log(`🗑️ Eliminando archivo de S3: ${key}`);
      
      const params = {
        Bucket: S3_CONFIG.bucket,
        Key: key
      };

      await s3.deleteObject(params).promise();
      
      console.log(`✅ Archivo eliminado exitosamente de S3: ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando archivo de S3:', error);
      // Si el archivo no existe, considerarlo como éxito
      if (error.code === 'NoSuchKey') {
        console.log(`ℹ️ Archivo no encontrado en S3: ${key}`);
        return true;
      }
      throw new Error(`Error al eliminar archivo de S3: ${error.message}`);
    }
  }

  // Eliminar imagen y sus variantes
  static async deleteImageAndVariants(type, filename) {
    try {
      console.log(`🗑️ Eliminando imagen y variantes de S3: ${filename}`);
      
      const baseName = filename.replace(/\.[^/.]+$/, ''); // Remover extensión
      const baseKey = getS3Key(type, filename);
      
      // Eliminar archivo principal
      await this.deleteFile(baseKey);
      
      // Buscar y eliminar variantes de tamaño
      const sizesKey = getS3Key('sizes', baseName);
      const sizesPrefix = sizesKey.replace(/\.[^/.]+$/, ''); // Remover extensión
      
      try {
        // Listar objetos con el prefijo para encontrar variantes
        const listParams = {
          Bucket: S3_CONFIG.bucket,
          Prefix: sizesPrefix
        };
        
        const objects = await s3.listObjectsV2(listParams).promise();
        
        if (objects.Contents && objects.Contents.length > 0) {
          // Eliminar en lotes de 1000 (límite de S3)
          const deleteParams = {
            Bucket: S3_CONFIG.bucket,
            Delete: {
              Objects: objects.Contents.map(obj => ({ Key: obj.Key })),
              Quiet: false
            }
          };
          
          await s3.deleteObjects(deleteParams).promise();
          console.log(`✅ ${objects.Contents.length} variantes eliminadas de S3`);
        }
      } catch (listError) {
        console.warn('⚠️ No se pudieron listar variantes para eliminar:', listError.message);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error eliminando imagen y variantes de S3:', error);
      throw error;
    }
  }

  // Obtener URL pública de S3
  static getPublicUrl(key) {
    return getS3Url(key);
  }

  // Verificar si archivo existe en S3
  static async fileExists(key) {
    try {
      const params = {
        Bucket: S3_CONFIG.bucket,
        Key: key
      };
      
      await s3.headObject(params).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
        return false;
      }
      throw error;
    }
  }

  // Obtener metadatos del archivo
  static async getFileMetadata(key) {
    try {
      const params = {
        Bucket: S3_CONFIG.bucket,
        Key: key
      };
      
      const result = await s3.headObject(params).promise();
      
      return {
        contentType: result.ContentType,
        contentLength: result.ContentLength,
        lastModified: result.LastModified,
        etag: result.ETag,
        metadata: result.Metadata
      };
    } catch (error) {
      if (error.code === 'NotFound' || error.code === 'NoSuchKey') {
        return null;
      }
      throw error;
    }
  }

  // Generar URL pre-firmada para acceso temporal
  static async generatePresignedUrl(key, expiresIn = 3600) {
    try {
      const params = {
        Bucket: S3_CONFIG.bucket,
        Key: key,
        Expires: expiresIn
      };
      
      const url = await s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      console.error('❌ Error generando URL pre-firmada:', error);
      throw new Error(`Error al generar URL pre-firmada: ${error.message}`);
    }
  }
}

module.exports = S3Service;
