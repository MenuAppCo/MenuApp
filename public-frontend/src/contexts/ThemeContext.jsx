import { createContext, useContext, useState, useEffect } from 'react'
import { useRestaurantSettings } from '../hooks/useRestaurant'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  // Proporcionar valores por defecto si theme es null
  const defaultTheme = {
    primaryColor: '#0ea5e9',
    secondaryColor: '#f59e0b',
    showPrices: true,
    showImages: true,
    primaryLanguage: 'es',
    multiLanguage: false,
    emailNotifications: true,
    analyticsNotifications: true,
  }
  
  return {
    ...context,
    theme: context.theme || defaultTheme
  }
}

export const ThemeProvider = ({ children }) => {
  const { data: settings, isLoading } = useRestaurantSettings()
  const [theme, setTheme] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Solo aplicar colores si no está cargando y hay settings
    if (!isLoading && settings) {
      setTheme(settings)
      setIsInitialized(true)
      
      // Aplicar los colores como variables CSS
      const root = document.documentElement
      
      // Color primario
      const primaryColor = settings.primaryColor || '#0ea5e9'
      root.style.setProperty('--color-primary', primaryColor)
      root.style.setProperty('--color-primary-50', `${primaryColor}0d`)
      root.style.setProperty('--color-primary-100', `${primaryColor}1a`)
      root.style.setProperty('--color-primary-200', `${primaryColor}33`)
      root.style.setProperty('--color-primary-300', `${primaryColor}4d`)
      root.style.setProperty('--color-primary-400', `${primaryColor}66`)
      root.style.setProperty('--color-primary-500', primaryColor)
      root.style.setProperty('--color-primary-600', primaryColor)
      root.style.setProperty('--color-primary-700', `${primaryColor}cc`)
      root.style.setProperty('--color-primary-800', `${primaryColor}99`)
      root.style.setProperty('--color-primary-900', `${primaryColor}66`)
      
      // Color secundario
      const secondaryColor = settings.secondaryColor || '#f59e0b'
      root.style.setProperty('--color-secondary', secondaryColor)
      root.style.setProperty('--color-secondary-50', `${secondaryColor}0d`)
      root.style.setProperty('--color-secondary-100', `${secondaryColor}1a`)
      root.style.setProperty('--color-secondary-200', `${secondaryColor}33`)
      root.style.setProperty('--color-secondary-300', `${secondaryColor}4d`)
      root.style.setProperty('--color-secondary-400', `${secondaryColor}66`)
      root.style.setProperty('--color-secondary-500', secondaryColor)
      root.style.setProperty('--color-secondary-600', secondaryColor)
      root.style.setProperty('--color-secondary-700', `${secondaryColor}cc`)
      root.style.setProperty('--color-secondary-800', `${secondaryColor}99`)
      root.style.setProperty('--color-secondary-900', `${secondaryColor}66`)
      
      console.log('🎨 Tema aplicado:', { primaryColor, secondaryColor })
    }
  }, [settings, isLoading])

  // Si aún no se ha inicializado, mostrar un estado de carga
  if (!isInitialized && isLoading) {
    return <div>Loading theme...</div>
  }

  const updateTheme = (newSettings) => {
    setTheme(newSettings)
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
} 