import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './components/Layout/DashboardLayout'
import { useAuth } from './lib/auth'

// Pages
import LoginPage from './pages/login'
import DashboardPage from './pages/dashboard'
import PlaceholderPage from './pages/placeholder'

// Super Admin Pages
import OrganizationsPage from './pages/organizations'
import AccountsPage from './pages/accounts'
import QRCodesPage from './pages/qr-codes'
import UsersPage from './pages/users'

// Client Admin Pages
import KiosksPage from './pages/kiosks'
import KioskDetailPage from './pages/kiosks/detail'
import PriceGoodsPage from './pages/price-goods'
import AdvertisementsPage from './pages/advertisements'
import StatisticsPage from './pages/statistics'
import PromotionsPage from './pages/promotions'
import WorkersPage from './pages/workers'

// Wrapper for login page - redirects if already authenticated
function LoginRoute() {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
}

function RootRedirect() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // All users go to dashboard after login
  return <Navigate to="/dashboard" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Public routes - with auth check wrapper */}
      <Route path="/login" element={<LoginRoute />} />

      {/* Super Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/organizations" element={<OrganizationsPage />} />
          <Route path="/qr-codes" element={<QRCodesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/devices" element={<PlaceholderPage title="Qurilmalar" />} />
        </Route>
      </Route>

      {/* Client Admin routes */}
      <Route element={<ProtectedRoute allowedRoles={['client_admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/my-company" element={<PlaceholderPage title="Mening kompaniyam" />} />
          <Route path="/branches" element={<PlaceholderPage title="Mening filiallarim" />} />
          <Route path="/specialists" element={<PlaceholderPage title="Mening mutaxassislarim" />} />
          <Route path="/specialist-requests" element={<PlaceholderPage title="Mutaxassislarga so'rovlar" />} />
          <Route path="/orders" element={<PlaceholderPage title="Buyurtmalar" />} />
          <Route path="/working-hours" element={<PlaceholderPage title="Ish vaqti" />} />
          <Route path="/plans-quotas" element={<PlaceholderPage title="Rejalar va kvotalar" />} />
          
          <Route path="/kiosks" element={<KiosksPage />} />
          <Route path="/kiosks/:id" element={<KioskDetailPage />} />
          <Route path="/price-goods" element={<PriceGoodsPage />} />
          <Route path="/advertisements" element={<AdvertisementsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/workers" element={<WorkersPage />} />
        </Route>
      </Route>

      {/* Shared routes - both roles can access */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'client_admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/firmware" element={<PlaceholderPage title="OTA Firmware" />} />
          <Route path="/cards" element={<PlaceholderPage title="RFID Kartalar" />} />
          <Route path="/sessions" element={<PlaceholderPage title="Yuvish seanslari" />} />
          <Route path="/reports" element={<PlaceholderPage title="Hisobotlar" />} />
          <Route path="/reviews" element={<PlaceholderPage title="Sharhlar" />} />
          <Route path="/services" element={<PlaceholderPage title="Xizmatlar" />} />
        </Route>
      </Route>

      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Catch all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
