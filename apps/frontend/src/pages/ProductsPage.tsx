import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { Plus, Search, Edit, Trash2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
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

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products', search],
    queryFn: async () => {
      console.log('🔍 Fetching products with search:', search)
      const authState = useAuthStore.getState()
      console.log('🔑 Auth State during fetch:', {
        isAuthenticated: authState.isAuthenticated,
        hasToken: !!authState.accessToken,
        companyId: authState.user?.companyId
      })
      
      try {
        const response = await api.get('/products', {
          params: { search }
        })
        console.log('📦 Products response:', response.data)
        console.log('📦 Products response type:', typeof response.data)
        console.log('📦 Products response isArray:', Array.isArray(response.data))
        console.log('📦 Products response length:', response.data?.length)
        return response.data
      } catch (error: any) {
        console.error('Error fetching products:', error)
        console.error('Error response:', error?.response?.data)
        throw error
      }
    },
    staleTime: 0, // Sempre considerar dados como stale
    gcTime: 0, // Não manter cache
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchOnMount: true, // Always refetch on mount
    retry: 3, // Retry failed requests
  })

  console.log('📊 Products state:', { products, isLoading, error })
  console.log('📊 Products data type:', typeof products)
  console.log('📊 Products isArray:', Array.isArray(products))
  console.log('📊 Products length:', products?.length)

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
    console.log('🔄 Invalidating queries after product creation/update...')
    console.log('Current products before invalidation:', products)
    
    // Clear all caches related to products
    queryClient.removeQueries({ queryKey: ['products'] })
    queryClient.invalidateQueries({ queryKey: ['products'] })
    queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
    queryClient.invalidateQueries({ queryKey: ['default-warehouse'] })
    queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
    
    // Force immediate refetch
    refetch()
    
    // Force refetch with a small delay to ensure backend has processed the data
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['products'] })
      console.log('✅ Queries invalidated and refetched after delay')
    }, 500)
    
    // Additional refetch after a longer delay as backup
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['products'] })
      console.log('✅ Backup refetch completed')
    }, 2000)
  }

  const handleDeleteProduct = async (product: any) => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${product.name}"?`)) {
      try {
        await api.delete(`/products/${product.id}`)
        toast.success('Produto deletado com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
        queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
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
      queryClient.invalidateQueries({ queryKey: ['inventory-summary'] })
      queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar movimentação')
    }
  }

  const handleStockMovementClose = () => {
    setStockMovementModal({ isOpen: false, product: null, type: 'IN' })
    setMovementQuantity(0)
    setMovementReason('')
  }

  const handleDebugTest = async () => {
    try {
      console.log('🔍 Testing debug endpoint...')
      const authState = useAuthStore.getState()
      console.log('🔑 Auth State:', {
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        hasToken: !!authState.accessToken
      })
      
      const response = await api.get('/products/test/debug')
      console.log('🔍 Debug response:', response.data)
      toast.success(`Debug: ${response.data.productsCount} produtos encontrados. CompanyId: ${response.data.companyId}`)
    } catch (error: any) {
      console.error('Debug test error:', error)
      console.error('Error response:', error.response?.data)
      toast.error(`Erro no teste de debug: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleSimpleTest = async () => {
    try {
      console.log('🔍 Testing simple endpoint...')
      const response = await api.get('/products/test/simple')
      console.log('🔍 Simple response:', response.data)
      toast.success(`Simple test: ${response.data.message}`)
    } catch (error: any) {
      console.error('Simple test error:', error)
      toast.error('Erro no teste simples')
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
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie seu catálogo de produtos</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleSimpleTest}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            title="Testar conexão simples"
          >
            Teste Simples
          </button>
          <button 
            onClick={handleDebugTest}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 flex items-center"
            title="Testar debug"
          >
            Debug
          </button>
          <button 
            onClick={() => refetch()}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
            title="Atualizar lista"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </button>
          <button 
            onClick={handleCreateProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">Erro ao carregar produtos</h3>
          <div className="text-sm text-red-700">
            {error.message || 'Erro desconhecido'}
          </div>
          <button 
            onClick={() => refetch()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <div>Products type: {typeof products}</div>
            <div>Products isArray: {Array.isArray(products) ? 'true' : 'false'}</div>
            <div>Products length: {products?.length || 0}</div>
            <div>IsLoading: {isLoading ? 'true' : 'false'}</div>
            <div>Error: {error ? 'true' : 'false'}</div>
            {error && <div>Error message: {error.message}</div>}
          </div>
        </div>
      )}

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
              {products && Array.isArray(products) && products.length > 0 ? products.map((product: any) => (
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
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {isLoading ? 'Carregando...' : 'Nenhum produto encontrado'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

