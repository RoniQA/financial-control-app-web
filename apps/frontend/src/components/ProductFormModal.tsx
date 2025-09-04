import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Save } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'
import { useDefaultWarehouse } from '../hooks/useDefaultWarehouse'

const productSchema = z.object({
  sku: z.string().min(1, 'SKU é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  unit: z.string().min(1, 'Unidade é obrigatória'),
  ncm: z.string().optional(),
  cest: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  costPrice: z.number().min(0, 'Preço de custo deve ser maior ou igual a 0'),
  markup: z.number().min(0, 'Markup deve ser maior ou igual a 0'),
  salePrice: z.number().min(0, 'Preço de venda deve ser maior ou igual a 0'),
  initialQuantity: z.number().min(0, 'Quantidade inicial deve ser maior ou igual a 0'),
  isActive: z.boolean().default(true),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: any
}

export function ProductFormModal({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const { data: defaultWarehouse } = useDefaultWarehouse()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    // setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      sku: '',
      name: '',
      description: '',
      category: '',
      brand: '',
      model: '',
      unit: 'UN',
      ncm: '',
      cest: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      costPrice: 0,
      markup: 0,
      salePrice: 0,
      initialQuantity: 0,
      isActive: true,
    },
  })

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      reset({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        brand: product.brand || '',
        model: product.model || '',
        unit: product.unit || 'UN',
        ncm: product.ncm || '',
        cest: product.cest || '',
        weight: product.weight || 0,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        costPrice: product.prices?.[0]?.costPrice || 0,
        markup: product.prices?.[0]?.markup || 0,
        salePrice: product.prices?.[0]?.salePrice || 0,
        initialQuantity: product.stocks?.[0]?.quantity || 0,
        isActive: product.isActive ?? true,
      })
    } else {
      reset({
        sku: '',
        name: '',
        description: '',
        category: '',
        brand: '',
        model: '',
        unit: 'UN',
        ncm: '',
        cest: '',
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        costPrice: 0,
        markup: 0,
        salePrice: 0,
        initialQuantity: 0,
        isActive: true,
      })
    }
  }, [product, reset])

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      // Generate unique SKU only for new products
      let finalSku = data.sku
      if (!product && (!data.sku || data.sku.trim() === '')) {
        const timestamp = Date.now().toString()
        const random1 = Math.random().toString(36).substring(2, 6).toUpperCase()
        const random2 = Math.random().toString(36).substring(2, 6).toUpperCase()
        finalSku = `PROD-${timestamp.slice(-8)}-${random1}-${random2}`
      }

      const productData = {
        name: data.name,
        description: data.description || undefined,
        category: data.category || undefined,
        brand: data.brand || undefined,
        model: data.model || undefined,
        unit: data.unit,
        ncm: data.ncm || undefined,
        cest: data.cest || undefined,
        weight: data.weight || undefined,
        dimensions: data.dimensions || undefined,
        isActive: data.isActive,
        isService: false, // Default to false for now
        companyId: user?.companyId,
      }

      // Only include SKU for new products
      if (!product) {
        (productData as any).sku = finalSku
      }


      if (product) {
        // Update existing product
        await api.patch(`/products/${product.id}`, productData)
        
        // Update price if changed
        if (data.costPrice > 0 || data.salePrice > 0) {
          await api.post(`/products/${product.id}/prices`, {
            costPrice: data.costPrice,
            markup: data.markup,
            salePrice: data.salePrice,
          })
        }
        
        // Update stock if quantity changed
        const currentStock = product.stocks?.reduce((sum: number, stock: any) => sum + stock.quantity, 0) || 0
        const stockDifference = data.initialQuantity - currentStock
        
        if (stockDifference !== 0 && defaultWarehouse) {
          await api.post('/inventory/stock-moves', {
            productId: product.id,
            warehouseId: defaultWarehouse.id,
            type: stockDifference > 0 ? 'IN' : 'OUT',
            quantity: Math.abs(stockDifference),
            reason: 'STOCK_ADJUSTMENT',
          })
        }
        
        toast.success('Produto atualizado com sucesso!')
      } else {
        // Create new product
        const response = await api.post('/products', productData)
        
        // Create initial price
        if (data.costPrice > 0 || data.salePrice > 0) {
          await api.post(`/products/${response.data.id}/prices`, {
            costPrice: data.costPrice,
            markup: data.markup,
            salePrice: data.salePrice,
          })
        }
        
        // Create initial stock if quantity > 0
        if (data.initialQuantity > 0 && defaultWarehouse) {
          console.log('Creating initial stock for product:', response.data.id, 'quantity:', data.initialQuantity)
          const stockMoveResponse = await api.post('/inventory/stock-moves', {
            productId: response.data.id,
            warehouseId: defaultWarehouse.id,
            type: 'IN',
            quantity: data.initialQuantity,
            reason: 'INITIAL_STOCK',
          })
          console.log('Stock move response:', stockMoveResponse.data)
        }
        
        toast.success('Produto criado com sucesso!')
      }

      reset()
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      
      let errorMessage = 'Erro ao salvar produto'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={handleClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              {product ? 'Editar Produto' : 'Novo Produto'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU *
                </label>
                <input
                  {...register('sku')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: PROD001"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome do produto"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <input
                  {...register('category')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Bombas, Válvulas"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marca
                </label>
                <input
                  {...register('brand')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Schneider, WEG"
                />
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo
                </label>
                <input
                  {...register('model')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Bomba-1/2CV-220V"
                />
              </div>

              {/* Unidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidade *
                </label>
                <select
                  {...register('unit')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="UN">Unidade</option>
                  <option value="KG">Quilograma</option>
                  <option value="M">Metro</option>
                  <option value="M2">Metro Quadrado</option>
                  <option value="M3">Metro Cúbico</option>
                  <option value="L">Litro</option>
                  <option value="CX">Caixa</option>
                  <option value="PC">Peça</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                )}
              </div>

              {/* NCM */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NCM
                </label>
                <input
                  {...register('ncm')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 8414.10.00"
                />
              </div>

              {/* CEST */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEST
                </label>
                <input
                  {...register('cest')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 28.038.00"
                />
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  {...register('weight', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              {/* Dimensões */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensões (cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    {...register('dimensions.length', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Comprimento"
                  />
                  <input
                    {...register('dimensions.width', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Largura"
                  />
                  <input
                    {...register('dimensions.height', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Altura"
                  />
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descrição detalhada do produto"
              />
            </div>

            {/* Preços e Estoque */}
            <div className="border-t pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-4">Preços e Estoque</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço de Custo *
                  </label>
                  <input
                    {...register('costPrice', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {errors.costPrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.costPrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Markup (%)
                  </label>
                  <input
                    {...register('markup', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {errors.markup && (
                    <p className="mt-1 text-sm text-red-600">{errors.markup.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço de Venda *
                  </label>
                  <input
                    {...register('salePrice', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                  />
                  {errors.salePrice && (
                    <p className="mt-1 text-sm text-red-600">{errors.salePrice.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantidade Inicial
                  </label>
                  <input
                    {...register('initialQuantity', { valueAsNumber: true })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                  {errors.initialQuantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.initialQuantity.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Produto ativo
              </label>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {product ? 'Atualizar' : 'Criar'} Produto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
