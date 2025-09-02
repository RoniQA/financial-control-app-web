import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'
import { InventoryPage } from './pages/InventoryPage'
import { PartnersPage } from './pages/PartnersPage'
import { OrdersPage } from './pages/OrdersPage'

import { FinancialPage } from './pages/FinancialPage'
import { FiscalPage } from './pages/FiscalPage'
import { ReportsPage } from './pages/ReportsPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/orders" element={<OrdersPage />} />

        <Route path="/financial" element={<FinancialPage />} />
        <Route path="/fiscal" element={<FiscalPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App

