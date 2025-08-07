import { NavLink, useNavigate } from 'react-router-dom'
import { 
  Home, 
  Package, 
  FolderOpen, 
  Settings, 
  LogOut,
  Menu,
  BookOpen
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true }) // Redirigir al login
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Menús', href: '/menus', icon: BookOpen },
    { name: 'Productos', href: '/products', icon: Package },
    { name: 'Categorías', href: '/categories', icon: FolderOpen },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ]

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
            <div className="flex items-center">
              <Menu className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold text-white">MenuApp</span>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          {/* Logout */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout} // Corregido: usar el nuevo manejador
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar 