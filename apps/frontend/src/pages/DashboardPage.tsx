import { useQuery } from '@tanstack/react-query'
import { 
  Package, 
  Users, 
  ShoppingCart, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import api from '../services/api'
import { SalesPurchaseCharts } from '../components/SalesPurchaseCharts'

export function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(res => res.data),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Alertas Importantes</h2>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 border-yellow-400' 
                  : 'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-center">
                <alert.icon className={`h-5 w-5 ${
                  alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                }`} />
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                  }`}>
                    {alert.title}
                  </h3>
                  <p className={`text-sm ${
                    alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                  }`}>
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Produtos</p>
              <p className="text-2xl font-bold text-gray-900">{totals?.products || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Parceiros</p>
              <p className="text-2xl font-bold text-gray-900">{totals?.partners || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{totals?.orders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Notas Fiscais</p>
              <p className="text-2xl font-bold text-gray-900">{totals?.invoices || 0}</p>
            </div>
          </div>
        </div>
      </div>

              {/* Charts Section */}
        <SalesPurchaseCharts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h2>
          </div>
          <div className="p-6">
            {recentOrders?.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.number}</p>
                      <p className="text-sm text-gray-600">{order.partner?.name || 'Sem parceiro'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        R$ {order.total?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum pedido encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Estoque Baixo</h2>
          </div>
          <div className="p-6">
            {lowStockProducts?.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((stock: any) => (
                  <div key={stock.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <p className="font-medium text-gray-900">{stock.product?.name || 'Produto'}</p>
                      <p className="text-sm text-gray-600">SKU: {stock.product?.sku || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-yellow-800">
                        {stock.quantity} unidades
                      </p>
                      <p className="text-xs text-yellow-600">Estoque baixo</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <p className="text-gray-500">Todos os produtos com estoque adequado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

