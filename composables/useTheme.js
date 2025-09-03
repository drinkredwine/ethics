export const useTheme = () => {
  const theme = useState('theme', () => 'dark') // Default to dark theme
  const isClient = process.client

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    if (isClient) {
      localStorage.setItem('theme', theme.value)
      updateHtmlClass()
    }
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    if (isClient) {
      localStorage.setItem('theme', newTheme)
      updateHtmlClass()
    }
  }

  const updateHtmlClass = () => {
    if (!isClient) return
    
    const html = document.documentElement
    if (theme.value === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const initTheme = () => {
    if (!isClient) return
    
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    updateHtmlClass()
  }

  // Theme classes for different components
  const getThemeClasses = () => {
    const isDark = theme.value === 'dark'
    
    return {
      // Main backgrounds
      pageBackground: isDark 
        ? 'min-h-screen bg-gray-900' 
        : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100',
      
      // Navigation
      navBackground: isDark 
        ? 'bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-800' 
        : 'bg-white shadow-sm',
      navText: isDark ? 'text-white' : 'text-gray-900',
      navTextSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
      navTextHover: isDark ? 'hover:text-white' : 'hover:text-gray-900',
      
      // Cards
      cardBackground: isDark ? 'bg-gray-800' : 'bg-white',
      cardBorder: isDark ? 'border-gray-700' : 'border-gray-200',
      cardShadow: isDark ? 'shadow-2xl' : 'shadow-lg',
      
      // Test cards (special styling for landing page)
      testCardBackground: isDark ? 'bg-gray-800' : 'bg-white',
      testCardFooter: isDark ? 'bg-gray-800' : 'bg-gray-50',
      
      // Text
      textPrimary: isDark ? 'text-white' : 'text-gray-900',
      textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
      textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
      
      // Buttons
      buttonPrimary: isDark 
        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
        : 'bg-indigo-600 text-white hover:bg-indigo-700',
      buttonSecondary: isDark 
        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      
      // Inputs
      inputBackground: isDark ? 'bg-gray-700' : 'bg-white',
      inputBorder: isDark ? 'border-gray-600' : 'border-gray-300',
      inputText: isDark ? 'text-white' : 'text-gray-900',
      inputPlaceholder: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
      
      // Feature section
      featureBackground: isDark 
        ? 'bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700' 
        : 'bg-white shadow-lg',
    }
  }

  return {
    theme: readonly(theme),
    toggleTheme,
    setTheme,
    initTheme,
    getThemeClasses
  }
}