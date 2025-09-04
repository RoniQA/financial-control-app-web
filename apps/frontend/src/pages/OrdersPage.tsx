import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../services/api'
import { OrderFormModal } from '../components/OrderFormModal'
import { OrderViewModal } from '../components/OrderViewModal'

export function OrdersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingOrder, setViewingOrder] = useState(null)
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', search, statusFilter],
    queryFn: async () => {
      const response = await api.get('/orders', {
        params: { search, status: statusFilter }
      })
      return response.data
    },
  })

  const handleCreateOrder = () => {
    setEditingOrder(null)
    setIsModalOpen(true)
  }

  const handleEditOrder = (order: any) => {
    setEditingOrder(order)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingOrder(null)
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
    queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      console.log('=== CHANGING ORDER STATUS ===')
      console.log('Order ID:', orderId)
      console.log('New Status:', newStatus)
      
      await api.patch(`/orders/${orderId}`, { 
        status: newStatus
      })
      toast.success('Status atualizado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
    } catch (error: any) {
      console.error('Error changing status:', error)
      toast.error(error.response?.data?.message || 'Erro ao atualizar status')
    }
  }

  const handleViewOrder = (order: any) => {
    setViewingOrder(order)
    setIsViewModalOpen(true)
  }

  const handleViewModalClose = () => {
    setIsViewModalOpen(false)
    setViewingOrder(null)
  }

  const handleDeleteOrder = async (order: any) => {
    if (window.confirm(`Tem certeza que deseja deletar o pedido ${order.number}?`)) {
      try {
        await api.delete(`/orders/${order.id}`)
        toast.success('Pedido deletado com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
        queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao deletar pedido')
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-600">Gerencie pedidos de compra e venda</p>
        </div>
        <button 
          onClick={handleCreateOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="DRAFT">Rascunho</option>
            <option value="PENDING">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="IN_PROGRESS">Em Andamento</option>
            <option value="COMPLETED">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente/Fornecedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders && Array.isArray(orders) && orders.map((order: any) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.type === 'PURCHASE' 
                        ? 'bg-blue-100 text-blue-800'
                        : order.type === 'SALE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.type === 'PURCHASE' ? 'Compra' : 
                       order.type === 'SALE' ? 'Venda' : order.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.partner?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                        order.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : order.status === 'APPROVED'
                          ? 'bg-blue-100 text-blue-800'
                                                     : order.status === 'IN_SEPARATION'
                           ? 'bg-purple-100 text-purple-800'
                           : order.status === 'IN_DELIVERY'
                           ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="DRAFT">Rascunho</option>
                      <option value="PENDING">Pendente</option>
                      <option value="APPROVED">Aprovado</option>
                      <option value="IN_SEPARATION">Em Separação</option>
             <option value="IN_DELIVERY">Em Rota de Entrega</option>
                      <option value="COMPLETED">Concluído</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderDate || order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Visualizar pedido"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditOrder(order)}
                        className="text-green-600 hover:text-green-900"
                        title="Editar pedido"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order)}
                        className="text-red-600 hover:text-red-900"
                        title="Deletar pedido"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {orders?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum pedido encontrado</p>
        </div>
      )}

      {/* Modals */}
      <OrderFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        order={editingOrder}
      />
      
      <OrderViewModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        order={viewingOrder}
      />
    </div>
  )
}

