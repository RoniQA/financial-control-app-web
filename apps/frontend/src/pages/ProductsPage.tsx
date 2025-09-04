import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import api from '../services/api'
import { ProductFormModal } from '../components/ProductFormModal'
import { toast } from 'react-hot-toast'
import { useDefaultWarehouse } from '../hooks/useDefaultWarehouse'

export function ProductsPage() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [stockMovementModal, setStockMovementModal] = useState<{
    isOpen: boolean
    product: any
    type: 'IN' | 'OUT'
  }>({ isOpen: false, product: null, type: 'IN' })
  const [movementQuantity, setMovementQuantity] = useState<number>(0)
  const [movementReason, setMovementReason] = useState<string>('')
  const queryClient = useQueryClient()
  const { data: defaultWarehouse } = useDefaultWarehouse()

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      const response = await api.get('/products', {
        params: { search }
      })
      return response.data
    },
  })

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const handleDeleteProduct = async (product: any) => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${product.name}"?`)) {
      try {
        await api.delete(`/products/${product.id}`)
        toast.success('Produto deletado com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['products'] })
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao deletar produto')
      }
    }
  }

  const handleStockMovement = (product: any, type: 'IN' | 'OUT') => {
    setStockMovementModal({ isOpen: true, product, type })
    setMovementQuantity(0)
    setMovementReason('')
  }

  const handleStockMovementSubmit = async () => {
    if (!stockMovementModal.product || movementQuantity <= 0) {
      toast.error('Informe uma quantidade válida')
      return
    }

    try {
      await api.post('/inventory/stock-moves', {
        productId: stockMovementModal.product.id,
        warehouseId: defaultWarehouse?.id,
        type: stockMovementModal.type,
        quantity: movementQuantity,
        reason: movementReason || 'AJUSTE_MANUAL',
      })

      toast.success(`Movimentação de ${stockMovementModal.type === 'IN' ? 'entrada' : 'saída'} realizada com sucesso!`)
      setStockMovementModal({ isOpen: false, product: null, type: 'IN' })
      setMovementQuantity(0)
      setMovementReason('')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar movimentação')
    }
  }

  const handleStockMovementClose = () => {
    setStockMovementModal({ isOpen: false, product: null, type: 'IN' })
    setMovementQuantity(0)
    setMovementReason('')
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
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <button 
          onClick={handleCreateProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </button>
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products && Array.isArray(products) && products.map((product: any) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R$ {product.prices?.[0]?.salePrice?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.stocks && Array.isArray(product.stocks) ? product.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0) : 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar produto"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStockMovement(product, 'IN')}
                        className="text-green-600 hover:text-green-900"
                        title="Adicionar estoque"
                      >
                        <TrendingUp className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleStockMovement(product, 'OUT')}
                        className="text-orange-600 hover:text-orange-900"
                        title="Remover estoque"
                      >
                        <TrendingDown className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-900"
                        title="Deletar produto"
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

      {products?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        product={editingProduct}
      />

      {/* Stock Movement Modal */}
      {stockMovementModal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Movimentação de Estoque
              </h3>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Produto:</strong> {stockMovementModal.product?.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>SKU:</strong> {stockMovementModal.product?.sku}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Estoque Atual:</strong> {stockMovementModal.product?.stocks && Array.isArray(stockMovementModal.product.stocks) ? stockMovementModal.product.stocks.reduce((sum: number, stock: any) => sum + stock.quantity, 0) : 0} {stockMovementModal.product?.unit || 'UN'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Movimentação
                  </label>
                  <div className={`px-3 py-2 rounded-md text-sm font-medium ${
                    stockMovementModal.type === 'IN' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stockMovementModal.type === 'IN' ? 'Entrada (+)' : 'Saída (-)'}
                  </div>
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
                  onClick={handleStockMovementClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStockMovementSubmit}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 ${
                    stockMovementModal.type === 'IN'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                >
                  {stockMovementModal.type === 'IN' ? 'Adicionar' : 'Remover'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

