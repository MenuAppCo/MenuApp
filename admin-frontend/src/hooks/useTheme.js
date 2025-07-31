import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContextContext'

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