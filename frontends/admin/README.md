# MenuApp - Frontend de Administración

Este es el frontend de administración para MenuApp, una aplicación de gestión de menús para restaurantes.

## Configuración de Variables de Entorno

### Desarrollo Local

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# URL del frontend público (menú para clientes)
VITE_PUBLIC_FRONTEND_URL=http://localhost:5174

# URL del backend API
VITE_API_URL=http://localhost:3000
```

### Producción

En producción, configura las siguientes variables de entorno:

```bash
# URL del frontend público (menú para clientes)
VITE_PUBLIC_FRONTEND_URL=https://tu-dominio.com

# URL del backend API
VITE_API_URL=https://api.tu-dominio.com
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Tecnologías Utilizadas

- React 18
- Vite
- Tailwind CSS
- Lucide React (iconos)
- React Router DOM
- React Hook Form
- Zod (validación)
