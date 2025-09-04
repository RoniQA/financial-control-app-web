import { X } from 'lucide-react'

interface OrderViewModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export function OrderViewModal({ isOpen, onClose, order }: OrderViewModalProps) {
  if (!isOpen || !order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800'
      case 'IN_SEPARATION':
        return 'bg-purple-100 text-purple-800'
      case 'IN_DELIVERY':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return 'bg-blue-100 text-blue-800'
      case 'SALE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'Rascunho'
      case 'PENDING': return 'Pendente'
      case 'APPROVED': return 'Aprovado'
      case 'IN_SEPARATION': return 'Em Separação'
      case 'IN_DELIVERY': return 'Em Rota de Entrega'
      case 'COMPLETED': return 'Concluído'
      case 'CANCELLED': return 'Cancelado'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'PURCHASE': return 'Compra'
      case 'SALE': return 'Venda'
      default: return type
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-900">
              Detalhes do Pedido - {order.number}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Informações do Pedido</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número:</span>
                    <span className="font-medium">{order.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(order.type)}`}>
                      {getTypeText(order.type)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data do Pedido:</span>
                    <span className="font-medium">
                      {new Date(order.orderDate || order.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {order.validUntil && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Válido até:</span>
                      <span className="font-medium">
                        {new Date(order.validUntil).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Cliente/Fornecedor</h4>
                {order.partner ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nome:</span>
                      <span className="font-medium">{order.partner.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documento:</span>
                      <span className="font-medium">{order.partner.document}</span>
                    </div>
                    {order.partner.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{order.partner.email}</span>
                      </div>
                    )}
                    {order.partner.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telefone:</span>
                        <span className="font-medium">{order.partner.phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum cliente/fornecedor associado</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Itens do Pedido</h4>
              {order.items && order.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantidade
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço Unit.
                        </th>
                        
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.items && Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.product?.name || 'Produto não encontrado'}
                            {item.product?.sku && (
                              <span className="text-gray-500 ml-2">({item.product.sku})</span>
                            )}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                                                     <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                             R$ {item.unitPrice?.toFixed(2) || '0.00'}
                           </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            R$ {item.total?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum item adicionado ao pedido</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Resumo Financeiro</h4>
                             <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-gray-600">Subtotal:</span>
                   <span className="font-medium">
                     R$ {(order.items && Array.isArray(order.items) ? order.items.reduce((sum: number, item: any) => sum + ((item.quantity * item.unitPrice) || 0), 0) : 0).toFixed(2)}
                   </span>
                 </div>
                 <div className="border-t pt-2">
                   <div className="flex justify-between">
                     <span className="text-lg font-semibold text-gray-900">Total:</span>
                     <span className="text-lg font-bold text-gray-900">
                       R$ {order.total?.toFixed(2) || '0.00'}
                     </span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Observações</h4>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
