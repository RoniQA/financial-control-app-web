import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'

import { Layout } from './components/Layout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { ProductsPage } from './pages/ProductsPage'
import { InventoryPage } from './pages/InventoryPage'
import { PartnersPage } from './pages/PartnersPage'
import { OrdersPage } from './pages/OrdersPage'

import { FinancialPage } from './pages/FinancialPage'
import { FiscalPage } from './pages/FiscalPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  const { isAuthenticated, user } = useAuthStore()

  // Debug logs
  console.log('App render - isAuthenticated:', isAuthenticated, 'user:', user)

  // Add loading state to prevent white screen
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate loading time to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando aplicação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App

