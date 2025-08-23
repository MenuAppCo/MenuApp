# Frontend de Administración - MenuApp

Este es el frontend de administración para MenuApp, construido con React, Vite y Tailwind CSS.

## Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

### Desarrollo Local
```bash
VITE_API_URL=http://localhost:3000
VITE_MEDIA_URL=media.menapp.co
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON=your_supabase_anon_key
VITE_PUBLIC_FRONTEND_URL=http://localhost:5174
```

### Producción
```bash
VITE_API_URL=https://api.tu-dominio.com
VITE_MEDIA_URL=media.menapp.co
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON=your_supabase_anon_key
VITE_PUBLIC_FRONTEND_URL=https://menu.tu-dominio.com
```

## Instalación y Desarrollo

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
