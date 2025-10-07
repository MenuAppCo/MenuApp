# MenuApp - Sistema SaaS de Menús Digitales
> [Visita aquí la demo](https://menapp.co/restaurants/srojas-1754593120604)

MenuApp es una plataforma SaaS completa para restaurantes que permite crear y gestionar menús digitales con una interfaz moderna y responsive. El proyecto está compuesto por tres aplicaciones principales:

## 🏗️ Arquitectura del Proyecto

### Backend (API REST)
- **Tecnología**: Node.js + Express + Prisma + SQLite
- **Puerto**: 3000
- **Funcionalidades**: API REST, autenticación JWT, gestión de archivos, procesamiento de imágenes

### Admin Frontend (Panel de Administración)
- **Tecnología**: React + Vite + Tailwind CSS
- **Puerto**: 5173
- **Funcionalidades**: Panel de administración para restaurantes, gestión de menús, productos, categorías

### Public Frontend (Menús Públicos)
- **Tecnología**: React + Vite + Tailwind CSS
- **Puerto**: 5174
- **Funcionalidades**: Visualización pública de menús, interfaz para clientes

## 🚀 Características Principales

- **Gestión de Restaurantes**: Múltiples restaurantes con sus propios menús
- **Menús Digitales**: Creación y gestión de menús con categorías y productos
- **Sistema de Imágenes**: Procesamiento automático de imágenes (múltiples tamaños)
- **Personalización**: Temas, colores y configuración personalizable
- **QR Codes**: Generación automática de códigos QR para menús
- **Responsive Design**: Interfaz adaptativa para móviles y desktop
- **Autenticación**: Sistema de login/registro seguro
- **Analytics**: Seguimiento de visitas y estadísticas

## 📋 Prerrequisitos

- **Node.js**: Versión 18.0.0 o superior
- **npm**: Gestor de paquetes de Node.js
- **Git**: Para clonar el repositorio

## 🛠️ Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/ElDanissito/MenuApp.git
cd MenuApp
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp env.example .env
```

#### Configurar Variables de Entorno (.env)

Edita el archivo `.env` en la carpeta `backend` con la siguiente configuración mínima para desarrollo:

```env
DATABASE_URL=file:./dev.db
JWT_SECRET=menuapp-dev-secret-key
NODE_ENV=development
```

#### Inicializar la Base de Datos

```bash
# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones
npm run migrate

```

### 3. Configurar Admin Frontend

```bash
cd ../admin-frontend

# Instalar dependencias
npm install
```

### 4. Configurar Public Frontend

```bash
cd ../public-frontend

# Instalar dependencias
npm install
```

## 🚀 Ejecutar el Proyecto

### Opción 1: Ejecutar en Terminales Separadas

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
El backend estará disponible en: http://localhost:3000

#### Terminal 2 - Admin Frontend
```bash
cd admin-frontend
npm run dev
```
El panel de administración estará disponible en: http://localhost:5173

#### Terminal 3 - Public Frontend
```bash
cd public-frontend
npm run dev
```
Los menús públicos estará disponible en: http://localhost:5174

### Opción 2: Usar el Script de PowerShell (Windows)

Si estás en Windows, puedes usar el script incluido para cargar las variables de entorno:

```powershell
cd backend
.\load-env.ps1
npm run dev
```

## 📱 Uso del Sistema

### 1. Registro de Restaurante
1. Ve a http://localhost:5173/register
2. Completa el formulario de registro
3. Inicia sesión con tus credenciales

### 2. Configuración Inicial
1. En el dashboard, configura la información básica del restaurante
2. Sube el logo del restaurante
3. Personaliza colores y tema

### 3. Crear Menús
1. Ve a la sección "Menús"
2. Crea categorías (ej: Entradas, Platos Principales, Postres)
3. Agrega productos con imágenes y precios
4. Organiza los productos en las categorías

### 4. Ver Menú Público
1. Ve a http://localhost:5174/restaurant/[slug-del-restaurante]
2. O escanea el código QR generado automáticamente

## 🗂️ Estructura del Proyecto

```
MenuApp/
├── backend/                 # API REST
│   ├── src/
│   │   ├── controllers/     # Controladores de la API
│   │   ├── routes/          # Rutas de la API
│   │   ├── middleware/      # Middlewares
│   │   └── services/        # Servicios
│   ├── prisma/              # Esquema de base de datos
│   └── uploads/             # Archivos subidos
├── admin-frontend/          # Panel de administración
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── hooks/           # Custom hooks
│   │   └── services/        # Servicios de API
└── public-frontend/         # Menús públicos
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── pages/           # Páginas públicas
    │   └── services/        # Servicios de API
```

## 🔧 Comandos Útiles

### Backend
```bash
npm run dev          # Ejecutar en modo desarrollo
npm run migrate      # Ejecutar migraciones de base de datos
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Cargar datos de ejemplo
```

### Frontend (ambos)
```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la build
```

## 🌐 Endpoints Principales

### Backend API (http://localhost:3000)
- `POST /api/auth/register` - Registro de restaurante
- `POST /api/auth/login` - Login
- `GET /api/restaurants/:slug` - Información del restaurante
- `GET /api/menus/:slug/:type` - Menú público
- `POST /api/upload` - Subir archivos

### Health Check
- `GET /health` - Estado del servidor

## 🔒 Seguridad

- Autenticación JWT
- Rate limiting
- Validación de datos con Joi
- Sanitización de inputs
- Headers de seguridad con Helmet
- CORS configurado

## 📊 Base de Datos

El proyecto utiliza SQLite para desarrollo con Prisma como ORM. El esquema incluye:

- **Users**: Propietarios de restaurantes
- **Restaurants**: Información de restaurantes
- **Menus**: Menús de cada restaurante
- **Categories**: Categorías de productos
- **Products**: Productos individuales
- **Analytics**: Estadísticas de visitas

## 🎨 Personalización

Cada restaurante puede personalizar:
- Colores primarios y secundarios
- Fuente de texto
- Logo del restaurante
- Información de contacto
- Redes sociales
- Configuración de precios

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa los logs del servidor
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que la base de datos esté inicializada
4. Comprueba que todos los servicios estén ejecutándose en los puertos correctos

## 🔄 Actualizaciones

Para actualizar el proyecto:

```bash
git pull origin main
cd backend && npm install
cd ../admin-frontend && npm install
cd ../public-frontend && npm install
```

---

**MenuApp** - Transformando la experiencia gastronómica digital 🍽️ 
