# Configuración de S3 para Subida de Imágenes

## Descripción

Este proyecto soporta **exclusivamente** la subida de imágenes a Amazon S3 para almacenamiento persistente. No hay soporte para almacenamiento local en desarrollo.

## Variables de Entorno Requeridas

### Para Producción (Lambda)
```bash
# AWS S3 Configuration
AWS_REGION=us-east-1          # Valor por defecto si no se especifica
S3_BUCKET_NAME=production-menapp-images  # Valor por defecto si no se especifica
# Las credenciales se obtienen automáticamente del rol IAM de Lambda
```

**Nota:** Las variables `AWS_REGION` y `S3_BUCKET_NAME` tienen valores por defecto para producción. Si no se configuran en GitHub Secrets, se usarán automáticamente:
- `AWS_REGION` → `us-east-1`
- `S3_BUCKET_NAME` → `production-menapp-images`

### Para Desarrollo Local
```bash
# AWS S3 Configuration (REQUERIDO para desarrollo)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET_NAME=dev-menapp-images
```

## Configuración en GitHub Secrets

### Variables Opcionales (con valores por defecto)
```bash
# Estas variables tienen valores por defecto para producción
# Si no las configuras, se usarán automáticamente
AWS_REGION=us-east-1
S3_BUCKET_NAME=production-menapp-images
```

### Variables Requeridas para Desarrollo Local
```bash
# Solo necesarias para desarrollo local
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Importante:** Para producción, solo necesitas configurar las credenciales si quieres usar valores diferentes a los predeterminados. El sistema funcionará automáticamente con los valores por defecto.

## Estructura del Bucket S3

El bucket S3 se organiza de la siguiente manera:

```
bucket-name/
├── products/          # Imágenes de productos
├── categories/        # Imágenes de categorías
├── restaurants/       # Logos de restaurantes
├── processed/         # Imágenes procesadas
└── sizes/            # Diferentes tamaños de imagen
    ├── thumbnail/     # 150x150
    ├── medium/        # 400x400
    └── large/         # 800x800
```

## Funcionalidades Implementadas

### 1. Subida de Imágenes
- ✅ Logo del restaurante (Settings)
- ✅ Imágenes de categorías
- ✅ Imágenes de productos

### 2. Procesamiento de Imágenes
- ✅ Redimensionamiento automático
- ✅ Conversión a WebP para mejor compresión
- ✅ Creación de múltiples tamaños
- ✅ Optimización de calidad

### 3. Almacenamiento
- ✅ S3 en producción
- ✅ S3 en desarrollo (requerido)
- ❌ No hay fallback a almacenamiento local

### 4. Gestión de Archivos
- ✅ Eliminación de imágenes
- ✅ Eliminación de variantes
- ✅ Limpieza automática

## Flujo de Subida

1. **Frontend** envía imagen como FormData
2. **Middleware** valida y procesa el archivo
3. **Servicio de Imágenes** optimiza la imagen
4. **Servicio S3** sube a S3 (o local en desarrollo)
5. **Base de datos** se actualiza con la nueva URL

## Configuración de IAM

Los roles de Lambda tienen los siguientes permisos S3:

### Admin API Lambda
- `s3:PutObject` - Subir imágenes
- `s3:GetObject` - Leer imágenes
- `s3:DeleteObject` - Eliminar imágenes
- `s3:ListBucket` - Listar contenido
- `s3:PutObjectAcl` - Configurar ACL
- `s3:DeleteObjectVersion` - Eliminar versiones

### Public API Lambda
- `s3:GetObject` - Leer imágenes
- `s3:ListBucket` - Listar contenido

## Desarrollo Local

Para desarrollo local **CON S3**:

1. **Configura OBLIGATORIAMENTE** las variables de AWS
2. Las imágenes se subirán a S3
3. Las URLs serán absolutas: `https://bucket.s3.region.amazonaws.com/products/image.jpg`
4. **No hay soporte para almacenamiento local**

## Producción

En producción (Lambda):

1. Las imágenes se suben automáticamente a S3
2. Las URLs son absolutas: `https://bucket.s3.region.amazonaws.com/products/image.jpg`
3. Se usan los permisos del rol IAM de Lambda

## Troubleshooting

### Error: "Access Denied" en S3
- Verifica que el rol IAM tenga los permisos correctos
- Asegúrate de que el bucket policy permita acceso desde Lambda

### Error: "Bucket not found"
- Verifica que `S3_BUCKET_NAME` esté configurado correctamente
- Asegúrate de que el bucket exista en la región especificada

### Error: "Credentials not found"
- En desarrollo: configura `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`
- En producción: verifica que el rol IAM esté configurado correctamente

## Monitoreo

Las operaciones S3 se registran con emojis para facilitar el debugging:

- 📤 Subida de archivo
- ✅ Operación exitosa
- ❌ Error
- 🗑️ Eliminación de archivo
- ⚠️ Advertencia

## Valores por Defecto

El sistema incluye valores por defecto para las variables críticas de S3:

| Variable | Valor por Defecto | Descripción |
|----------|-------------------|-------------|
| `AWS_REGION` | `us-east-1` | Región de AWS donde se encuentra el bucket |
| `S3_BUCKET_NAME` | `production-menapp-images` | Nombre del bucket S3 para imágenes |

Estos valores se usan automáticamente si las variables de entorno no están configuradas, lo que hace que el sistema sea más robusto y fácil de configurar.

## Próximos Pasos

- [ ] Implementar CDN (CloudFront) para mejor rendimiento
- [ ] Agregar compresión adicional de imágenes
- [ ] Implementar backup automático de imágenes
- [ ] Agregar métricas de uso de S3
