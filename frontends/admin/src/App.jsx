import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';

import PublicRoute from './components/auth/PublicRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileChecker from './components/auth/ProfileChecker';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import CompleteProfile from './pages/auth/CompleteProfile';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard/Dashboard';
import Menus from './pages/menus/Menus';
import Products from './pages/products/Products';
import Categories from './pages/categories/Categories';
import Settings from './pages/settings/Settings';
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

          {/* Sin PublicRoute a proposito: al abrir el enlace de recuperacion
              Supabase crea una sesion, con lo que PublicRoute redirigiria al
              dashboard y nunca se llegaria a cambiar la contraseña. */}
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute><ProfileChecker /></ProtectedRoute>}>
            <Route path="/*" element={<ThemeProvider><Layout /></ThemeProvider>}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="menus" element={<Menus />} />
              <Route path="products" element={<Products />} />
              <Route path="categories" element={<Categories />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;