# Configuración de S3 para Subida de Imágenes

## Descripción

Este proyecto soporta **exclusivamente** la subida de imágenes a Amazon S3 para almacenamiento persistente. No hay soporte para almacenamiento local en desarrollo.

## Variables de Entorno Requeridas

### Para Producción (Lambda)
```bash
# AWS S3 Configuration
AWS_REGION=us-east-1
S3_IMAGES_BUCKET_NAME=production-menapp-images
# Las credenciales se obtienen automáticamente del rol IAM de Lambda
```

**Nota:** ninguna de las dos tiene valor por defecto en el código. `src/config/s3.js`
las lee tal cual:

```js
const s3 = new S3Client({ region: process.env.AWS_REGION });
const S3_CONFIG = { bucket: process.env.S3_IMAGES_BUCKET_NAME, ... };
```

Si faltan, el bucket queda `undefined` y las subidas fallan. En producción funciona
porque Terraform las inyecta en la Lambda
(`iac/backend/lambda/admin_api_lambda.tf`), no porque el código tenga un respaldo.

### Para Desarrollo Local
```bash
# AWS S3 Configuration (REQUERIDO para desarrollo)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_IMAGES_BUCKET_NAME=dev-menapp-images
```

## Configuración en Terraform

El nombre del bucket llega a las Lambda desde Terraform, no desde GitHub Secrets:

```hcl
# iac/backend/lambda/admin_api_lambda.tf
environment {
  variables = {
    S3_IMAGES_BUCKET_NAME = var.s3_images_bucket_name
  }
}

# iac/backend/vars.tf
variable "s3_images_bucket_name" {
  default = "production-menapp-images"
}
```

Ese `default` de Terraform es el único valor por defecto que existe, y aplica al
desplegar, no en tiempo de ejecución.

### Variables Requeridas para Desarrollo Local
```bash
# Solo necesarias para desarrollo local
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Importante:** en local hay que configurar las cuatro variables. No hay respaldo
en el código y una subida sin ellas falla.

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
3. **No hay soporte para almacenamiento local**

## Producción

En producción (Lambda):

1. Las imágenes se suben automáticamente a S3
2. Se usan los permisos del rol IAM de Lambda

## Cómo se Sirven las Imágenes

En la base de datos **no se guarda una URL**, sino la clave relativa dentro del
bucket:

```
products/image-1756171897778-633541247-processed.webp
```

Los frontends le anteponen el host de `VITE_MEDIA_URL` (`media.menapp.co` por
defecto) en `utils/imageUtils`. Ese host es una distribución de CloudFront
definida en `iac/backend/cloudfront/media.tf`.

El bucket es **privado**: su política solo permite leer a CloudFront, mediante
Origin Access Control. Por eso `https://<bucket>.s3.<region>.amazonaws.com/<clave>`
responde `403` y no sirve como enlace alternativo.

`VITE_MEDIA_URL` se escribe **sin esquema**, porque el código construye
`https://${VITE_MEDIA_URL}/${clave}`. Si se pone `https://...` la URL resultante
queda con el esquema duplicado y no carga.

## Troubleshooting

### Error: "Access Denied" en S3
- Verifica que el rol IAM tenga los permisos correctos
- Asegúrate de que el bucket policy permita acceso desde Lambda

### Error: "Bucket not found" o "S3_IMAGES_BUCKET_NAME no está configurado"
- Verifica que `S3_IMAGES_BUCKET_NAME` esté configurado (ojo: no es `S3_BUCKET_NAME`)
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

## Variables que Lee el Código

| Variable | Dónde se lee | Por defecto |
|----------|--------------|-------------|
| `AWS_REGION` | `src/config/s3.js` | ninguno |
| `S3_IMAGES_BUCKET_NAME` | `src/config/s3.js` | ninguno |
| `AWS_ACCESS_KEY_ID` | SDK de AWS | ninguno (en Lambda: rol IAM) |
| `AWS_SECRET_ACCESS_KEY` | SDK de AWS | ninguno (en Lambda: rol IAM) |

Ninguna tiene respaldo en el código. Si falta el bucket, `S3Service.uploadFile`
corta con un error explícito en vez de intentar la subida contra `undefined`.

## Próximos Pasos

- [x] Implementar CDN (CloudFront) para mejor rendimiento
- [ ] Agregar compresión adicional de imágenes
- [ ] Implementar backup automático de imágenes
- [ ] Agregar métricas de uso de S3
