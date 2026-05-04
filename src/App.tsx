import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import { I18nProvider } from './components/i18n-provider'
import { AuthProvider } from './lib/auth'
import { AppRouter } from './router'

import { ConfigProvider, theme } from 'antd';
import { useTheme } from 'next-themes';

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#3b82f6',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          colorBgBase: isDark ? '#0f172a' : '#f8fafc',
          colorBgContainer: isDark ? '#0f172a' : '#ffffff',
          colorBorder: isDark ? '#1e293b' : '#e2e8f0',
        },
        components: {
          Button: {
            borderRadius: 8,
            controlHeight: 40,
            fontWeight: 600,
          },
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
          Card: {
            borderRadiusLG: 12,
          },
        }
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AntdConfigProvider>
          <AuthProvider>
            <I18nProvider>
              <AppRouter />
            </I18nProvider>
          </AuthProvider>
        </AntdConfigProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
