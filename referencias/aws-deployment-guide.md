# 🚀 Guía de Despliegue AWS para MenuApp SaaS

## 📋 Prerrequisitos

### Cuenta AWS
- Cuenta AWS activa con acceso a IAM
- Usuario IAM con permisos de administrador (temporalmente)
- Facturación configurada

### Dominio
- Dominio registrado (ej: menuapp.com)
- Acceso al panel de DNS del proveedor

### Conocimientos
- Docker y Docker Compose
- Linux básico (Ubuntu)
- Conceptos básicos de redes y seguridad

---

## 🏗️ Arquitectura AWS Recomendada

### 🎯 Para MVP (Inicio)
```
Internet → Route 53 → CloudFront → EC2 (t2.medium) → Docker Compose
                                    ↓
                              RDS (db.t3.micro)
                              S3 (imágenes)
```

### 🚀 Para Escalabilidad (Crecimiento)
```
Internet → Route 53 → CloudFront → ALB → ECS Fargate → RDS Multi-AZ
                                    ↓              ↓
                              S3 + CloudFront   ElastiCache Redis
```

---

## 📦 Configuración de Servicios AWS

### 1. 🖥️ EC2 Instance

#### Especificaciones Recomendadas
- **Tipo**: t3.medium (2 vCPU, 4 GB RAM)
- **OS**: Ubuntu Server 22.04 LTS
- **Storage**: 20 GB SSD gp3
- **Security Group**: Ver configuración de seguridad

#### Configuración de la Instancia
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Instalar Nginx
sudo apt install nginx -y

# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y
```

### 2. 🗄️ RDS PostgreSQL

#### Configuración
- **Engine**: PostgreSQL 15
- **Instance**: db.t3.micro (inicio) → db.t3.small (crecimiento)
- **Storage**: 20 GB gp3
- **Multi-AZ**: No (inicio) → Sí (producción)
- **Backup**: 7 días de retención
- **Maintenance**: Ventana de mantenimiento configurada

#### Variables de Entorno
```env
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/menuapp"
```

### 3. 📦 S3 Bucket

#### Configuración
- **Nombre**: menuapp-uploads-[region]
- **Region**: Misma que EC2
- **Versioning**: Habilitado
- **Lifecycle**: Eliminar versiones antiguas después de 30 días
- **CORS**: Configurado para subida de imágenes

#### Política CORS
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT"],
    "AllowedOrigins": ["https://menuapp.com", "https://*.menuapp.com"],
    "ExposeHeaders": []
  }
]
```

### 4. 🌐 CloudFront Distribution

#### Configuración
- **Origin**: S3 bucket para imágenes
- **Behaviors**: 
  - `/images/*` → S3
  - `/*` → EC2 (ALB en el futuro)
- **SSL**: Certificate Manager
- **Compression**: Habilitado
- **Cache**: 24 horas para imágenes

### 5. 📧 SES (Simple Email Service)

#### Configuración
- **Region**: us-east-1 (recomendado)
- **Domain**: Verificar dominio menuapp.com
- **DKIM**: Configurar registros DNS
- **Sending Quota**: Solicitar aumento si es necesario

---

## 🔒 Configuración de Seguridad

### Security Groups

#### EC2 Security Group
```
Inbound Rules:
- HTTP (80)     → 0.0.0.0/0
- HTTPS (443)   → 0.0.0.0/0
- SSH (22)      → Tu IP personal
- Custom (3000) → 0.0.0.0/0 (backend)

Outbound Rules:
- All traffic   → 0.0.0.0/0
```

#### RDS Security Group
```
Inbound Rules:
- PostgreSQL (5432) → EC2 Security Group

Outbound Rules:
- All traffic → 0.0.0.0/0
```

### IAM Roles y Políticas

#### EC2 Role
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::menuapp-uploads-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 🐳 Docker Compose para Producción

### docker-compose.prod.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION}
      - S3_BUCKET=${S3_BUCKET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  frontend:
    build: ./frontend
    environment:
      - VITE_API_URL=${API_URL}
      - VITE_STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx:/etc/nginx/conf.d
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 📊 Monitoreo y Logs

### CloudWatch
- **Log Groups**: Crear para cada servicio
- **Metrics**: CPU, memoria, disco, red
- **Alarms**: Configurar alertas para:
  - CPU > 80%
  - Memoria > 85%
  - Disco > 90%
  - Errores HTTP 5xx

### Health Checks
```bash
#!/bin/bash
# health-check.sh

# Verificar backend
if curl -f http://localhost:3000/health; then
    echo "Backend OK"
else
    echo "Backend FAILED"
    exit 1
fi

# Verificar base de datos
if docker exec menuapp_postgres_1 pg_isready; then
    echo "Database OK"
else
    echo "Database FAILED"
    exit 1
fi
```

---

## 🔄 Backup y Recuperación

### Backup Automático
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Backup de base de datos
docker exec menuapp_postgres_1 pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Backup de archivos
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ./uploads/

# Subir a S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql s3://menuapp-backups/
aws s3 cp $BACKUP_DIR/uploads_$DATE.tar.gz s3://menuapp-backups/

# Limpiar backups antiguos (mantener 7 días)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

### Cron Job
```bash
# Agregar al crontab
0 2 * * * /opt/menuapp/scripts/backup.sh
```

---

## 💰 Estimación de Costos (Mensual)

### MVP (Inicio)
- **EC2 t3.medium**: ~$30
- **RDS db.t3.micro**: ~$15
- **S3 (10GB)**: ~$0.25
- **CloudFront**: ~$5
- **Route 53**: ~$0.50
- **SES**: ~$1
- **Total**: ~$52/mes

### Crecimiento (100+ restaurantes)
- **EC2 t3.large**: ~$60
- **RDS db.t3.small**: ~$30
- **S3 (100GB)**: ~$2.50
- **CloudFront**: ~$15
- **ElastiCache**: ~$25
- **Total**: ~$133/mes

---

## 🚀 Script de Despliegue Automático

### deploy.sh
```bash
#!/bin/bash

echo "🚀 Iniciando despliegue de MenuApp..."

# Variables
PROJECT_DIR="/opt/menuapp"
GIT_REPO="https://github.com/tu-usuario/menuapp.git"

# Crear directorio del proyecto
sudo mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clonar repositorio
git clone $GIT_REPO .

# Configurar variables de entorno
cp .env.example .env
# Editar .env con valores reales

# Construir y levantar contenedores
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# Ejecutar migraciones
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

# Configurar SSL
sudo certbot --nginx -d menuapp.com -d www.menuapp.com

# Configurar renovación automática de SSL
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

echo "✅ Despliegue completado!"
```

---

## 🔧 Troubleshooting Común

### Problemas de Conexión a RDS
```bash
# Verificar conectividad
telnet your-rds-endpoint 5432

# Verificar security groups
aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx
```

### Problemas de SSL
```bash
# Verificar certificado
sudo certbot certificates

# Renovar manualmente
sudo certbot renew --force-renewal
```

### Problemas de Performance
```bash
# Verificar uso de recursos
htop
df -h
docker stats

# Verificar logs
docker-compose logs backend
docker-compose logs frontend
```

---

## 📈 Escalabilidad Futura

### Migración a ECS Fargate
1. Crear ECS Cluster
2. Definir Task Definitions
3. Crear Application Load Balancer
4. Configurar Auto Scaling
5. Migrar datos gradualmente

### Migración a RDS Multi-AZ
1. Crear snapshot de la instancia actual
2. Restaurar en nueva instancia Multi-AZ
3. Actualizar variables de entorno
4. Verificar conectividad

### Implementación de CDN
1. Configurar CloudFront para todo el sitio
2. Implementar cache headers
3. Optimizar imágenes automáticamente
4. Configurar invalidation automática

---

## 📞 Soporte y Mantenimiento

### Tareas Diarias
- [ ] Verificar health checks
- [ ] Revisar logs de errores
- [ ] Monitorear uso de recursos

### Tareas Semanales
- [ ] Revisar métricas de CloudWatch
- [ ] Verificar backups
- [ ] Actualizar dependencias de seguridad

### Tareas Mensuales
- [ ] Revisar costos AWS
- [ ] Actualizar certificados SSL
- [ ] Optimizar configuración de cache
- [ ] Revisar políticas de seguridad 