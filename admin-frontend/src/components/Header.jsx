import { Bell, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Panel de Control
          </h1>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || 'Restaurante'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || 'admin@restaurante.com'}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-4 w-4 text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 