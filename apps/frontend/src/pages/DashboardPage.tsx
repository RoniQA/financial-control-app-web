import { useQuery } from '@tanstack/react-query'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  FileText, 
  AlertTriangle, 
  CheckCircle
} from 'lucide-react'
import api from '../services/api'
import { SalesPurchaseCharts } from '../components/SalesPurchaseCharts'

export function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(res => res.data),
    retry: 1,
  })

  console.log('DashboardPage - isLoading:', isLoading, 'error:', error, 'data:', dashboardData)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Erro ao carregar dashboard</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  const { totals, recentOrders, lowStockProducts } = dashboardData || {}

  // Calculate alerts
  const alerts = []
  
  if (lowStockProducts?.length > 0) {
    alerts.push({
      type: 'warning',
      title: 'Estoque Baixo',
      message: `${lowStockProducts.length} produtos com estoque baixo`,
      icon: AlertTriangle,
    })
  }

  if (recentOrders?.length === 0) {
    alerts.push({
      type: 'info',
      title: 'Nenhum Pedido',
      message: 'Ainda não há pedidos cadastrados',
      icon: ShoppingCart,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED': return 'text-red-600 bg-red-100'
      case 'APPROVED': return 'text-blue-600 bg-blue-100'
      case 'IN_SEPARATION': return 'text-purple-600 bg-purple-100'
      case 'IN_DELIVERY': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Concluído'
      case 'PENDING': return 'Pendente'
      case 'CANCELLED': return 'Cancelado'
      case 'APPROVED': return 'Aprovado'
      case 'IN_SEPARATION': return 'Em Separação'
      case 'IN_DELIVERY': return 'Em Rota de Entrega'
      default: return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-secondary-600 dark:text-dark-textSecondary mt-2">
            Visão geral do seu negócio
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-dark-textSecondary bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 dark:border-dark-border">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse-slow"></div>
          <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-dark-text">Alertas Importantes</h2>
          <div className="grid gap-4">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                  alert.type === 'warning' 
                    ? 'bg-gradient-to-r from-warning-50 to-warning-100/50 border-warning-400 shadow-glow-warning' 
                    : 'bg-gradient-to-r from-accent-50 to-accent-100/50 border-accent-400 shadow-glow'
                }`}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${
                    alert.type === 'warning' ? 'bg-warning-100' : 'bg-accent-100'
                  }`}>
                    <alert.icon className={`h-6 w-6 ${
                      alert.type === 'warning' ? 'text-warning-600' : 'text-accent-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-semibold ${
                      alert.type === 'warning' ? 'text-warning-900' : 'text-accent-900'
                    }`}>
                      {alert.title}
                    </h3>
                    <p className={`text-sm ${
                      alert.type === 'warning' ? 'text-warning-700' : 'text-accent-700'
                    }`}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl shadow-soft p-6 border border-white/20 dark:border-dark-border hover:shadow-large transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-dark-textSecondary">Produtos</p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-dark-text">{totals?.products || 0}</p>
              </div>
            </div>
            <div className="text-success-500 text-sm font-medium">
              +12%
            </div>
          </div>
        </div>

        <div className="group bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl shadow-soft p-6 border border-white/20 dark:border-dark-border hover:shadow-large transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-success rounded-xl shadow-glow-success">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-dark-textSecondary">Parceiros</p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-dark-text">{totals?.partners || 0}</p>
              </div>
            </div>
            <div className="text-success-500 text-sm font-medium">
              +8%
            </div>
          </div>
        </div>

        <div className="group bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl shadow-soft p-6 border border-white/20 dark:border-dark-border hover:shadow-large transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-warm rounded-xl shadow-glow-warning">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-dark-textSecondary">Pedidos</p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-dark-text">{totals?.orders || 0}</p>
              </div>
            </div>
            <div className="text-success-500 text-sm font-medium">
              +24%
            </div>
          </div>
        </div>

        <div className="group bg-white/80 dark:bg-dark-surface/80 backdrop-blur-xl rounded-2xl shadow-soft p-6 border border-white/20 dark:border-dark-border hover:shadow-large transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-secondary rounded-xl shadow-glow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-600 dark:text-dark-textSecondary">Notas Fiscais</p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-dark-text">{totals?.invoices || 0}</p>
              </div>
            </div>
            <div className="text-success-500 text-sm font-medium">
              +15%
            </div>
          </div>
        </div>
      </div>

              {/* Charts Section */}
        <SalesPurchaseCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 bg-gradient-to-r from-primary-50 to-accent-50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-900">Pedidos Recentes</h2>
            </div>
          </div>
          <div className="p-6">
            {recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-secondary-50 to-white rounded-xl border border-white/20 hover:shadow-medium transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">{order.number}</p>
                        <p className="text-sm text-secondary-600">{order.partner?.name || 'Sem parceiro'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-sm font-medium text-secondary-700 mt-1">
                        R$ {order.total?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-secondary-400" />
                </div>
                <p className="text-secondary-500 font-medium">Nenhum pedido encontrado</p>
                <p className="text-sm text-secondary-400 mt-1">Os pedidos aparecerão aqui quando criados</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20 bg-gradient-to-r from-warning-50 to-warning-100/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-warning-600" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-900">Estoque Baixo</h2>
            </div>
          </div>
          <div className="p-6">
            {lowStockProducts?.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((stock: any) => (
                  <div key={stock.id} className="group flex items-center justify-between p-4 bg-gradient-to-r from-warning-50 to-warning-100/30 rounded-xl border border-warning-200 hover:shadow-medium transition-all duration-200 hover:scale-[1.02]">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-warning-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-secondary-900">{stock.product?.name || 'Produto'}</p>
                        <p className="text-sm text-secondary-600">SKU: {stock.product?.sku || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-warning-800">
                        {stock.quantity} unidades
                      </p>
                      <p className="text-xs text-warning-600 font-medium">Estoque baixo</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-success-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-success-500" />
                </div>
                <p className="text-success-700 font-medium">Todos os produtos com estoque adequado</p>
                <p className="text-sm text-success-600 mt-1">Seu estoque está em dia!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

