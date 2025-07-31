import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import PublicMenu from './pages/public/PublicMenu'
import PublicRestaurant from './pages/public/PublicRestaurant'
import PublicMenus from './pages/public/PublicMenus'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/restaurant/:slug" element={<PublicRestaurant />} />
          <Route path="/restaurant/:slug/menus" element={<PublicMenus />} />
          <Route path="/menu/:slug/:menuType" element={<PublicMenu />} />
        </Routes>
        {/* TODO Notificaciones */}
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
