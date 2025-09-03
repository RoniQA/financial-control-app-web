import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Receipt, 
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, color: 'primary' },
  { name: 'Produtos', href: '/products', icon: Package, color: 'accent' },
  { name: 'Estoque', href: '/inventory', icon: Warehouse, color: 'success' },
  { name: 'Parceiros', href: '/partners', icon: Users, color: 'warning' },
  { name: 'Pedidos', href: '/orders', icon: ShoppingCart, color: 'danger' },
  { name: 'Financeiro', href: '/financial', icon: DollarSign, color: 'success' },
  { name: 'Fiscal', href: '/fiscal', icon: Receipt, color: 'secondary' },
  { name: 'Relatórios', href: '/reports', icon: BarChart3, color: 'accent' },
  { name: 'Configurações', href: '/settings', icon: Settings, color: 'secondary' },
]

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      primary: isActive 
        ? 'bg-gradient-primary text-white shadow-glow' 
        : 'text-primary-600 hover:bg-primary-50 hover:text-primary-700',
      accent: isActive 
        ? 'bg-gradient-secondary text-white shadow-glow' 
        : 'text-accent-600 hover:bg-accent-50 hover:text-accent-700',
      success: isActive 
        ? 'bg-gradient-success text-white shadow-glow-success' 
        : 'text-success-600 hover:bg-success-50 hover:text-success-700',
      warning: isActive 
        ? 'bg-gradient-warm text-white shadow-glow-warning' 
        : 'text-warning-600 hover:bg-warning-50 hover:text-warning-700',
      danger: isActive 
        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-glow-danger' 
        : 'text-danger-600 hover:bg-danger-50 hover:text-danger-700',
      secondary: isActive 
        ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-medium' 
        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-700',
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.primary
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-gradient-to-b from-slate-50/95 via-slate-100/90 to-slate-200/85 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-600/85 backdrop-blur-xl shadow-2xl animate-slide-in">
          <div className="flex h-20 items-center justify-between px-6 bg-gradient-primary">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Gestus</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${getColorClasses(item.color, isActive)}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'}`}>
        <div className="flex flex-col flex-grow bg-gradient-to-b from-slate-50/95 via-slate-100/90 to-slate-200/85 dark:from-slate-800/95 dark:via-slate-700/90 dark:to-slate-600/85 backdrop-blur-xl border-r border-slate-200/40 dark:border-slate-600/40 shadow-2xl">
          <div className="flex h-20 items-center justify-between px-6 bg-gradient-primary">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-white">Gestus</h1>
                  <p className="text-xs text-white/80">App de Gerenciamento</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 text-sm font-medium rounded-xl transition-all duration-200 ${getColorClasses(item.color, isActive)}`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={`${sidebarCollapsed ? '' : 'mr-3'} h-5 w-5`} />
                  {!sidebarCollapsed && item.name}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-slate-200/30 dark:border-slate-600/30">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-3 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-xl border border-slate-200/20 dark:border-slate-600/20`}>
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 dark:text-dark-text truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-dark-textSecondary truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-72'}`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-slate-200/30 dark:border-slate-600/30 bg-slate-100/90 dark:bg-slate-700/90 backdrop-blur-xl px-4 shadow-soft sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-slate-700 dark:text-slate-300 lg:hidden hover:text-primary-600 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Botão para expandir menu recolhido (desktop) */}
          {sidebarCollapsed && (
            <button
              type="button"
              className="hidden lg:block -m-2.5 p-2.5 text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors"
              onClick={() => setSidebarCollapsed(false)}
              title="Expandir menu"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:flex lg:items-center lg:space-x-4">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  Olá, <span className="font-medium text-slate-900 dark:text-slate-100">{user?.firstName}</span>
                </div>
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-all duration-200"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

