# 📁 Estructura del Proyecto MenuApp SaaS

```
menu-saas/
├── 📦 backend/
│   ├── 📄 prisma/
│   │   ├── schema.prisma          ← Esquema de base de datos
│   │   ├── migrations/            ← Migraciones de Prisma
│   │   └── seed.js               ← Datos iniciales
│   ├── 📁 uploads/               ← Imágenes temporales (antes de S3)
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   ├── database.js       ← Configuración de Prisma
│   │   │   ├── redis.js          ← Configuración de Redis
│   │   │   ├── aws.js            ← Configuración AWS
│   │   │   └── stripe.js         ← Configuración Stripe
│   │   ├── 📁 routes/
│   │   │   ├── auth.js           ← Autenticación
│   │   │   ├── restaurants.js    ← Gestión de restaurantes
│   │   │   ├── categories.js     ← CRUD categorías
│   │   │   ├── products.js       ← CRUD productos
│   │   │   ├── analytics.js      ← Analytics y estadísticas
│   │   │   ├── subscriptions.js  ← Gestión de suscripciones
│   │   │   ├── uploads.js        ← Subida de archivos
│   │   │   └── public.js         ← API pública para menús
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   ├── restaurantController.js
│   │   │   ├── categoryController.js
│   │   │   ├── productController.js
│   │   │   ├── analyticsController.js
│   │   │   ├── subscriptionController.js
│   │   │   └── uploadController.js
│   │   ├── 📁 middleware/
│   │   │   ├── auth.js           ← Verificación JWT
│   │   │   ├── rateLimit.js      ← Rate limiting
│   │   │   ├── validation.js     ← Validación de datos
│   │   │   ├── upload.js         ← Multer config
│   │   │   └── subscription.js   ← Verificación de plan
│   │   ├── 📁 services/
│   │   │   ├── awsService.js     ← Servicios AWS (S3, SES)
│   │   │   ├── stripeService.js  ← Integración Stripe
│   │   │   ├── analyticsService.js ← Tracking analytics
│   │   │   ├── emailService.js   ← Envío de emails
│   │   │   └── qrService.js      ← Generación de QR
│   │   ├── 📁 utils/
│   │   │   ├── validation.js     ← Esquemas de validación
│   │   │   ├── helpers.js        ← Funciones auxiliares
│   │   │   └── constants.js      ← Constantes del sistema
│   │   ├── 📁 jobs/
│   │   │   ├── emailJobs.js      ← Tareas de email
│   │   │   ├── analyticsJobs.js  ← Procesamiento analytics
│   │   │   └── cleanupJobs.js    ← Limpieza de archivos
│   │   └── 📄 index.js           ← Servidor principal
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   └── 📄 .env.example
│
├── 🎨 frontend/
│   ├── 📁 public/
│   │   ├── 📄 index.html
│   │   ├── 📁 icons/             ← Iconos y favicons
│   │   └── 📁 locales/           ← Archivos de idiomas
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/        ← Componentes reutilizables
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── Alert.jsx
│   │   │   ├── 📁 layout/        ← Componentes de layout
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── 📁 forms/         ← Formularios
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   └── SettingsForm.jsx
│   │   │   └── 📁 dashboard/     ← Componentes del dashboard
│   │   │       ├── StatsCard.jsx
│   │   │       ├── ProductCard.jsx
│   │   │       └── AnalyticsChart.jsx
│   │   ├── 📁 pages/
│   │   │   ├── 📁 auth/          ← Páginas de autenticación
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── 📁 dashboard/     ← Páginas del dashboard
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Products.jsx
│   │   │   │   ├── Categories.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Settings.jsx
│   │   │   │   └── Subscription.jsx
│   │   │   └── 📁 public/        ← Páginas públicas
│   │   │       └── Menu.jsx      ← Menú público del restaurante
│   │   ├── 📁 hooks/             ← Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── useAnalytics.js
│   │   ├── 📁 store/             ← Estado global (Zustand)
│   │   │   ├── authStore.js
│   │   │   ├── uiStore.js
│   │   │   └── index.js
│   │   ├── 📁 services/          ← Servicios de API
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── 📁 utils/             ← Utilidades
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validation.js
│   │   ├── 📁 styles/            ← Estilos globales
│   │   │   ├── globals.css
│   │   │   └── tailwind.css
│   │   ├── 📄 App.jsx
│   │   ├── 📄 main.jsx
│   │   └── 📄 index.css
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   └── 📄 tailwind.config.js
│
├── 🌐 nginx/
│   ├── 📄 default.conf           ← Configuración principal
│   ├── 📄 ssl.conf              ← Configuración SSL
│   └── 📄 gzip.conf             ← Compresión
│
├── 🐳 docker/
│   ├── 📄 docker-compose.yml     ← Orquestación de contenedores
│   ├── 📄 docker-compose.prod.yml ← Producción
│   ├── 📄 docker-compose.dev.yml  ← Desarrollo
│   └── 📁 scripts/
│       ├── 📄 deploy.sh          ← Script de despliegue
│       ├── 📄 backup.sh          ← Script de backup
│       └── 📄 ssl-renew.sh       ← Renovación SSL
│
├── 📊 monitoring/
│   ├── 📄 docker-compose.monitoring.yml
│   ├── 📁 prometheus/
│   │   └── 📄 prometheus.yml
│   ├── 📁 grafana/
│   │   └── 📄 dashboards/
│   └── 📁 sentry/
│       └── 📄 sentry.conf.py
│
├── 📋 docs/
│   ├── 📄 API.md                 ← Documentación de la API
│   ├── 📄 DEPLOYMENT.md          ← Guía de despliegue
│   ├── 📄 AWS_SETUP.md           ← Configuración AWS
│   └── 📄 TROUBLESHOOTING.md     ← Solución de problemas
│
├── 🔧 scripts/
│   ├── 📄 setup.sh               ← Script de configuración inicial
│   ├── 📄 migrate.sh             ← Script de migraciones
│   ├── 📄 seed.sh                ← Script de datos iniciales
│   └── 📄 health-check.sh        ← Verificación de salud
│
├── 📄 .env.example               ← Variables de entorno de ejemplo
├── 📄 .gitignore
├── 📄 README.md
└── 📄 docker-compose.yml         ← Archivo principal
```

## 🏗️ Arquitectura de Servicios

### 🐳 Contenedores Docker
- **backend**: API Node.js + Express
- **frontend**: React + Vite
- **postgres**: Base de datos PostgreSQL
- **redis**: Cache y sesiones
- **nginx**: Reverse proxy y servidor web
- **prometheus**: Métricas y monitoreo
- **grafana**: Dashboards de monitoreo

### ☁️ Servicios AWS
- **EC2**: Servidor principal
- **RDS**: Base de datos PostgreSQL
- **S3**: Almacenamiento de imágenes
- **CloudFront**: CDN para assets
- **Route 53**: DNS y dominio
- **SES**: Envío de emails
- **ElastiCache**: Redis en la nube
- **CloudWatch**: Logs y métricas

### 🔒 Seguridad
- **HTTPS** con Let's Encrypt
- **Rate limiting** por IP
- **CORS** configurado
- **Helmet** para headers de seguridad
- **Validación** de inputs
- **Sanitización** de datos

### 📊 Monitoreo
- **Prometheus** para métricas
- **Grafana** para visualización
- **Sentry** para tracking de errores
- **CloudWatch** para logs AWS
- **Health checks** automáticos