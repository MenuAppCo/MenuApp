import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext'; // <-- AÑADIDO

// Rutas y Componentes
import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileChecker from './components/auth/ProfileChecker';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompleteProfile from './pages/auth/CompleteProfile';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Menus from './pages/menus/Menus';
import Products from './pages/products/Products';
import Categories from './pages/categories/Categories';
import Settings from './pages/settings/Settings';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <Routes>
      {/* Rutas públicas (solo para usuarios no logueados) */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Ruta para completar el perfil (solo para usuarios logueados sin perfil) */}
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />

      {/* Rutas principales protegidas */}
      <Route element={<ProtectedRoute><ProfileChecker /></ProtectedRoute>}>
        {/* Envolvemos el Layout con el ThemeProvider */}
        <Route path="/*" element={<ThemeProvider><Layout /></ThemeProvider>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menus" element={<Menus />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
          {/* Cualquier otra ruta protegida va aquí */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;