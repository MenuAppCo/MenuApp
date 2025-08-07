import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { ThemeContext } from './ThemeContextContext'

export const ThemeProvider = ({ children }) => {
  const { restaurantData } = useAuth()
  const [theme, setTheme] = useState(null)

  console.log('[ThemeProvider] Renderizando ThemeProvider:', {
    restaurantData: restaurantData ? 'Presente' : 'Ausente',
    theme: theme ? 'Configurado' : 'No configurado'
  });

  useEffect(() => {
    // Aplicar colores cuando tengamos datos del restaurante
    if (restaurantData) {
      setTheme(restaurantData)
      
      // Aplicar los colores como variables CSS
      const root = document.documentElement
      
      // Color primario
      const primaryColor = restaurantData.primaryColor || '#0ea5e9'
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
      const secondaryColor = restaurantData.secondaryColor || '#f59e0b'
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
      
      console.log('🎨 Tema aplicado desde restaurantData:', { primaryColor, secondaryColor })
    } else {
      console.log('🎨 Usando tema por defecto (no hay restaurantData)')
    }
  }, [restaurantData])



  const updateTheme = (newSettings) => {
    setTheme(newSettings)
  }

  console.log('[ThemeProvider] Renderizando children');
  
  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
} 