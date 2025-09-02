import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, AlertCircle, Check, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../services/api'

export function FinancialPage() {
  const [activeTab, setActiveTab] = useState('balance')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments', search, typeFilter],
    queryFn: async () => {
      const response = await api.get('/financial/payments', {
        params: { search, type: typeFilter }
      })
      return response.data
    },
    enabled: activeTab === 'payments',
  })

  const { data: balance } = useQuery({
    queryKey: ['company-balance'],
    queryFn: () => api.get('/financial/balance').then(res => res.data),
    enabled: activeTab === 'balance',
  })

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['financial-notifications'],
    queryFn: () => {
      console.log('🔍 Fetching financial notifications...');
      return api.get('/financial/notifications').then(res => {
        console.log('📊 Notifications received:', res.data);
        return res.data;
      });
    },
  })

  if (isLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'balance', name: 'Saldo', icon: DollarSign },
    { id: 'notifications', name: 'Notificações', icon: AlertCircle },
    { id: 'payments', name: 'Pagamentos', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600">Controle financeiro e fluxo de caixa</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Novo Pagamento
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
                {tab.id === 'notifications' && notifications?.filter((n: any) => n.status === 'PENDING').length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {notifications.filter((n: any) => n.status === 'PENDING').length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'balance' && (
        <div className="space-y-6">
          {/* Company Balance */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Saldo da Empresa
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Entradas */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-600">Total Entradas</p>
                      <p className="text-lg font-bold text-green-900">
                        R$ {balance?.totalInbound?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Saídas */}
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-600">Total Saídas</p>
                      <p className="text-lg font-bold text-red-900">
                        R$ {balance?.totalOutbound?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Saldo Líquido */}
                <div className={`rounded-lg p-4 ${
                  (balance?.balance || 0) >= 0 ? 'bg-blue-50' : 'bg-orange-50'
                }`}>
                  <div className="flex items-center">
                    {(balance?.balance || 0) >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-orange-600" />
                    )}
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        (balance?.balance || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        Saldo Líquido
                      </p>
                      <p className={`text-lg font-bold ${
                        (balance?.balance || 0) >= 0 ? 'text-blue-900' : 'text-orange-900'
                      }`}>
                        R$ {balance?.balance?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          {/* Financial Notifications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Notificações Financeiras
                </h2>
                {notifications?.filter((n: any) => n.status === 'PENDING').length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {notifications.filter((n: any) => n.status === 'PENDING').length}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              {notifications?.filter((n: any) => n.status === 'PENDING').length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma notificação financeira pendente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications?.filter((n: any) => n.status === 'PENDING').map((notification: any) => (
                    <div
                      key={notification.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <DollarSign className={`h-4 w-4 mr-2 ${
                              notification.type === 'INBOUND' ? 'text-green-600' : 'text-red-600'
                            }`} />
                            <span className={`text-sm font-medium ${
                              notification.type === 'INBOUND' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {notification.type === 'INBOUND' ? 'Entrada' : 'Saída'}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-900 mb-1">
                            {notification.description}
                          </p>
                          
                          <p className="text-sm text-gray-500">
                            Pedido: {notification.order.number} | 
                            {notification.partner?.name && ` Cliente: ${notification.partner.name}`}
                          </p>
                          
                          <p className="text-lg font-bold text-gray-900 mt-2">
                            R$ {notification.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              if (window.confirm('Deseja aprovar esta transação financeira?')) {
                                api.post(`/financial/notifications/${notification.id}/approve`)
                                  .then(() => {
                                    toast.success('Notificação aprovada e pagamento registrado!')
                                    window.location.reload()
                                  })
                                  .catch((error: any) => {
                                    toast.error(error.response?.data?.message || 'Erro ao aprovar notificação')
                                  })
                              }
                            }}
                            className="flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aprovar
                          </button>
                          
                          <button
                            onClick={() => {
                              if (window.confirm('Deseja rejeitar esta transação financeira?')) {
                                api.post(`/financial/notifications/${notification.id}/reject`)
                                  .then(() => {
                                    toast.success('Notificação rejeitada!')
                                    window.location.reload()
                                  })
                                  .catch((error: any) => {
                                    toast.error(error.response?.data?.message || 'Erro ao rejeitar notificação')
                                  })
                              }
                            }}
                            className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeitar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white shadow rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar pagamentos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos os tipos</option>
                <option value="INBOUND">Entrada</option>
                <option value="OUTBOUND">Saída</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments?.map((payment: any) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.description || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.type === 'INBOUND' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payment.type === 'INBOUND' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {payment.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.paidAt 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.paidAt ? 'Pago' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {payments?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum pagamento encontrado</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

