import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Plus, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-hot-toast'
import api from '../services/api'

const orderSchema = z.object({
  type: z.enum(['PURCHASE', 'SALE'], {
    required_error: 'Tipo é obrigatório',
  }),
  partnerId: z.string().min(1, 'Cliente/Fornecedor é obrigatório'),
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'IN_SEPARATION', 'IN_DELIVERY', 'COMPLETED', 'CANCELLED'], {
    required_error: 'Status é obrigatório',
  }),
  orderDate: z.string().min(1, 'Data do pedido é obrigatória'),
  notes: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

interface OrderFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  order?: any
}

export function OrderFormModal({ isOpen, onClose, onSuccess, order }: OrderFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderItems, setOrderItems] = useState<any[]>([])

  const { data: partners } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const response = await api.get('/partners')
      return response.data
    },
  })

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/products')
      return response.data
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      type: 'SALE',
      status: 'DRAFT',
    },
  })

  const orderType = watch('type')

  useEffect(() => {
    if (order) {
      reset({
        type: order.type || 'SALE',
        partnerId: order.partnerId || '',
        status: order.status || 'DRAFT',
        orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: order.notes || '',
      })
      
      // Load order items with proper structure
      const items = order.items || []
      const formattedItems = (items && Array.isArray(items) ? items : []).map((item: any) => ({
        productId: item.productId || '',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        total: item.total || 0
      }))
      
      setOrderItems(formattedItems)
    } else {
      reset({
        type: 'SALE',
        status: 'DRAFT',
        orderDate: new Date().toISOString().split('T')[0],
      })
      setOrderItems([])
    }
  }, [order, reset])

  // Update prices when order type changes
  useEffect(() => {
    if (orderItems.length > 0 && products && orderType) {
      const updatedItems = (orderItems && Array.isArray(orderItems) ? orderItems : []).map(item => {
        if (item.productId) {
          const selectedProduct = products.find((p: any) => p.id === item.productId)
          if (selectedProduct && selectedProduct.prices && selectedProduct.prices.length > 0) {
            const latestPrice = selectedProduct.prices[0]
            let newPrice = 0
            
            if (orderType === 'PURCHASE') {
              newPrice = latestPrice.costPrice || 0
            } else {
              newPrice = latestPrice.salePrice || latestPrice.costPrice || 0
            }
            
            return {
              ...item,
              unitPrice: newPrice,
              total: (parseFloat(item.quantity) || 0) * newPrice
            }
          }
        }
        return item
      })
      setOrderItems(updatedItems)
    }
  }, [orderType])

  const addItem = () => {
    setOrderItems([...orderItems, {
      productId: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }])
  }

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    // If product is selected, auto-fill the price based on order type
    if (field === 'productId' && value) {
      const selectedProduct = products?.find((p: any) => p.id === value)
      if (selectedProduct && selectedProduct.prices && selectedProduct.prices.length > 0) {
        const latestPrice = selectedProduct.prices[0]
        
        // Use cost price for purchases, sale price for sales
        if (orderType === 'PURCHASE') {
          updatedItems[index].unitPrice = latestPrice.costPrice || 0
        } else {
          updatedItems[index].unitPrice = latestPrice.salePrice || latestPrice.costPrice || 0
        }
      }
    }
    
    // Recalculate total (quantity * unitPrice)
    const quantity = parseFloat(updatedItems[index].quantity) || 0
    const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0
    updatedItems[index].total = quantity * unitPrice
    
    setOrderItems(updatedItems)
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
  }

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true)
    try {
      // Generate order number
      const timestamp = Date.now().toString()
      const orderNumber = `${data.type === 'SALE' ? 'VENDA' : 'COMPRA'}-${timestamp.slice(-6)}`

      const total = calculateTotal()

      const filteredItems = orderItems.filter(item => item.productId && item.quantity > 0)
      
      const orderData = {
        number: orderNumber,
        type: data.type,
        status: data.status,
        partnerId: data.partnerId,
        userId: 'cmf1uv2n10006z0axvz756zd1', // Admin user ID
        total: total,
        items: filteredItems,
        orderDate: data.orderDate,
        notes: data.notes,
      }

      console.log('=== SENDING ORDER DATA ===')
      console.log('Order Data:', orderData)
      console.log('Filtered Items:', filteredItems)
      console.log('All Order Items:', orderItems)

      if (order) {
        await api.patch(`/orders/${order.id}`, orderData)
        toast.success('Pedido atualizado com sucesso!')
      } else {
        await api.post('/orders', orderData)
        toast.success('Pedido criado com sucesso!')
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar pedido')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {order ? 'Editar Pedido' : 'Novo Pedido'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pedido
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SALE">Venda</option>
                <option value="PURCHASE">Compra</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente/Fornecedor
              </label>
              <select
                {...register('partnerId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um cliente/fornecedor</option>
                {partners && Array.isArray(partners) && partners.map((partner: any) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} ({partner.type === 'CUSTOMER' ? 'Cliente' : 
                                    partner.type === 'SUPPLIER' ? 'Fornecedor' : 'Ambos'})
                  </option>
                ))}
              </select>
              {errors.partnerId && (
                <p className="text-red-500 text-xs mt-1">{errors.partnerId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Rascunho</option>
                <option value="PENDING">Pendente</option>
                <option value="APPROVED">Aprovado</option>
                <option value="IN_SEPARATION">Em Separação</option>
                <option value="IN_DELIVERY">Em Rota de Entrega</option>
                <option value="COMPLETED">Concluído</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data do Pedido
              </label>
              <input
                type="date"
                {...register('orderDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.orderDate && (
                <p className="text-red-500 text-xs mt-1">{errors.orderDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre o pedido..."
              />
            </div>

            {/* Products Section */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Produtos</h4>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Produto
                </button>
              </div>

              {orderItems.length > 0 && (
                <div className="space-y-3">
                  {orderItems && Array.isArray(orderItems) && orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 p-4 border rounded-md bg-gray-50">
                      <div className="col-span-5">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Produto
                        </label>
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione um produto</option>
                          {products && Array.isArray(products) && products.map((product: any) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - {product.sku}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Qtd"
                          min="1"
                          step="1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Preço Unit.
                        </label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="R$ 0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <input
                          type="number"
                          value={item.total}
                          readOnly
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-100 font-semibold"
                          placeholder="R$ 0,00"
                        />
                      </div>
                      <div className="col-span-1 flex items-end justify-center">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remover produto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="mt-4 flex justify-end">
                <div className="text-lg font-semibold">
                  Total: R$ {calculateTotal().toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Salvando...' : order ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
