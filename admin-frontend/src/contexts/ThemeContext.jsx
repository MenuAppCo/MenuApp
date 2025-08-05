import { useState, useEffect } from 'react'
import { useRestaurantSettings } from '../hooks/useRestaurant'
import { ThemeContext } from './ThemeContextContext'

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="float-animation">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" className="h-16 w-16">
            <path fill="#E1E8ED" d="M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0s18 8.059 18 18"/>
            <path fill="#CCD6DD" d="M30 18c0 6.628-5.372 12-12 12S6 24.628 6 18 11.372 6 18 6s12 5.372 12 12"/>
            <path fill="#E1E8ED" d="M29 18c0 6.075-4.925 11-11 11S7 24.075 7 18 11.925 7 18 7s11 4.924 11 11"/>
            <g fill="#99AAB5">
              <circle cx="1" cy="1" r="1"/>
              <path d="M0 1h2v7H0z"/>
              <circle cx="5" cy="1" r="1"/>
              <path d="M4 1h2v7H4z"/>
              <circle cx="9" cy="1" r="1"/>
              <path d="M8 1h2v7H8zM3 14h4v20H3z"/>
              <circle cx="5" cy="34" r="2"/>
              <path d="M8 8a1 1 0 0 1-2 0H4a1 1 0 0 1-2 0H0c0 3.866 1 7 5 7s5-3.134 5-7z"/>
              <circle cx="1" cy="8" r="1"/>
              <circle cx="5" cy="8" r="1"/>
              <circle cx="9" cy="8" r="1"/>
            </g>
            <g fill="#99AAB5">
              <path d="M30 14h4v20h-4z"/>
              <circle cx="32" cy="34" r="2"/>
              <path d="M32 0c1 0 2 1 2 3v16s-7 2-7-8c0-6 3-11 5-11"/>
            </g>
          </svg>
        </div>
      </div>
    )
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