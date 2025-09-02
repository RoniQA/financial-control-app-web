import { useQuery } from '@tanstack/react-query'
import { Package, TrendingUp, TrendingDown, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import api from '../services/api'

export function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN')
  const [movementQuantity, setMovementQuantity] = useState<number>(0)
  const [movementReason, setMovementReason] = useState<string>('')
  const [selectedProductForMovement, setSelectedProductForMovement] = useState<string>('')
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'in-stock'>('all')

  const { data: stockSummary, isLoading, refetch } = useQuery({
    queryKey: ['inventory-summary'],
    queryFn: async () => {
      const response = await api.get('/inventory/summary')
      return response.data
    },
  })

  const { data: allProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products')
      return response.data
    },
  })

  // Filter stock data based on selected filter
  const filteredStock = stockSummary?.filter((item: any) => {
    switch (filter) {
      case 'low-stock':
        return item.quantity <= 5
      case 'in-stock':
        return item.quantity > 0
      default:
        return true
    }
  }) || []

  const handleStockMovement = async () => {
    const productId = selectedProduct?.product?.id || selectedProductForMovement
    const warehouseId = selectedProduct?.warehouse?.id || 'cmf1uv2n8000az0axienbav97' // Estoque Principal

    if (!productId || movementQuantity <= 0) {
      toast.error('Selecione um produto e informe uma quantidade válida')
      return
    }

    try {
      await api.post('/inventory/stock-moves', {
        productId,
        warehouseId,
        type: movementType,
        quantity: movementQuantity,
        reason: movementReason || 'AJUSTE_MANUAL',
      })

      toast.success(`Movimentação de ${movementType === 'IN' ? 'entrada' : 'saída'} realizada com sucesso!`)
      setSelectedProduct(null)
      setSelectedProductForMovement('')
      setMovementQuantity(0)
      setMovementReason('')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar movimentação')
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
        <p className="text-gray-600">Controle de inventário e movimentações</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
            filter === 'in-stock' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setFilter('in-stock')}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Produtos em Estoque
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stockSummary?.filter((item: any) => item.quantity > 0).length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
            filter === 'all' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => setFilter('all')}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total em Estoque
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stockSummary?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div 
          className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
            filter === 'low-stock' ? 'ring-2 ring-red-500' : ''
          }`}
          onClick={() => setFilter('low-stock')}
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Produtos com Estoque Baixo
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stockSummary?.filter((item: any) => item.quantity <= 5).length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Status */}
      {filter !== 'all' && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-800">
                Filtro ativo: {
                  filter === 'low-stock' ? 'Produtos com Estoque Baixo' :
                  filter === 'in-stock' ? 'Produtos em Estoque' : 'Todos os Produtos'
                }
              </span>
            </div>
            <button
              onClick={() => setFilter('all')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpar Filtro
            </button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Resumo do Estoque
            </h3>
            <button
              onClick={() => setSelectedProduct({})}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Movimentação
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Armazém
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Disponível
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStock?.map((item: any) => (
                  <tr key={`${item.product.id}-${item.warehouse.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.warehouse.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reserved} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity - item.reserved} {item.product.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedProduct(item)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        <Plus className="h-4 w-4 inline" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(item)
                          setMovementType('OUT')
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Minus className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stock Movement Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedProduct.product ? 'Movimentação de Estoque' : 'Nova Movimentação'}
              </h3>
              
              {selectedProduct.product ? (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <strong>Produto:</strong> {selectedProduct.product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>SKU:</strong> {selectedProduct.product.sku}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Estoque Atual:</strong> {selectedProduct.quantity} {selectedProduct.product.unit}
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecionar Produto
                  </label>
                  <select
                    value={selectedProductForMovement}
                    onChange={(e) => setSelectedProductForMovement(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um produto</option>
                    {allProducts?.map((product: any) => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Movimentação
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value as 'IN' | 'OUT')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="IN">Entrada (+)</option>
                    <option value="OUT">Saída (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={movementQuantity}
                    onChange={(e) => setMovementQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a quantidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo
                  </label>
                  <select
                    value={movementReason}
                    onChange={(e) => setMovementReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione um motivo</option>
                    <option value="COMPRA">Compra</option>
                    <option value="VENDA">Venda</option>
                    <option value="AJUSTE_MANUAL">Ajuste Manual</option>
                    <option value="TRANSFERENCIA">Transferência</option>
                    <option value="INVENTARIO">Inventário</option>
                    <option value="PERDA">Perda</option>
                    <option value="DEVOLUCAO">Devolução</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    setSelectedProductForMovement('')
                    setMovementQuantity(0)
                    setMovementReason('')
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStockMovement}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 ${
                    movementType === 'IN'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  {movementType === 'IN' ? 'Adicionar' : 'Remover'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

