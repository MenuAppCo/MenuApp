import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Menus from './pages/menus/Menus'
import Products from './pages/products/Products'
import Categories from './pages/categories/Categories'
import Settings from './pages/settings/Settings'
import ProtectedRoute from './components/auth/ProtectedRoute'
import useAuthStore from './hooks/useAuth'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rutas protegidas con ThemeProvider */}
          <Route path="/" element={
            <ThemeProvider>
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            </ThemeProvider>
          }>
            <Route index element={<Dashboard />} />
            <Route path="menus" element={<Menus />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        
        {/* Notificaciones */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

export default App
