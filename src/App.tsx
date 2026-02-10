import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { I18nProvider } from './components/i18n-provider'
import { AuthProvider } from './lib/auth'
import { AppRouter } from './router'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <I18nProvider>
            <AppRouter />
            <Toaster />
          </I18nProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
