import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, Calendar, BarChart3 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import api from '../services/api'

export function ReportsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Export functions
  const exportToCSV = (data: any[], filename: string, headers: string[]) => {
    if (!data || data.length === 0) {
      toast.error('Nenhum dado para exportar')
      return
    }

    const csvContent = [
      headers.join(','),
      ...(data && Array.isArray(data) ? data.map(row => 
        (headers && Array.isArray(headers) ? headers : []).map(header => {
          const value = row[header] || ''
          return `"${String(value).replace(/"/g, '""')}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Relatório exportado com sucesso!')
  }

  const exportSalesReport = () => {
    const headers = ['Número', 'Cliente', 'Status', 'Total', 'Data']
    const data = (salesReport && Array.isArray(salesReport) ? salesReport : []).map((order: any) => ({
      'Número': order.number,
      'Cliente': order.partner?.name || 'N/A',
      'Status': order.status,
      'Total': order.total?.toFixed(2) || '0.00',
      'Data': new Date(order.createdAt).toLocaleDateString('pt-BR')
    })) || []
    
    exportToCSV(data, 'relatorio_vendas', headers)
  }

  const exportInventoryReport = () => {
    const headers = ['Produto', 'Depósito', 'Quantidade', 'Localização']
    const data = (inventoryReport && Array.isArray(inventoryReport) ? inventoryReport : []).map((stock: any) => ({
      'Produto': stock.product.name,
      'Depósito': stock.warehouse.name,
      'Quantidade': stock.quantity,
      'Localização': stock.location || 'N/A'
    })) || []
    
    exportToCSV(data, 'relatorio_estoque', headers)
  }

  const exportFinancialReport = () => {
    const headers = ['Tipo', 'Método', 'Valor Total', 'Quantidade de Transações']
    const data = (financialReport && Array.isArray(financialReport) ? financialReport : []).map((item: any) => ({
      'Tipo': item.type === 'INBOUND' ? 'Entradas' : 'Saídas',
      'Método': item.method,
      'Valor Total': item._sum?.amount?.toFixed(2) || '0.00',
      'Quantidade de Transações': item._count?.id || 0
    })) || []
    
    exportToCSV(data, 'relatorio_financeiro', headers)
  }

  const { data: salesReport, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-report', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/reports/sales', {
        params: { startDate, endDate }
      })
      return response.data
    },
  })

  const { data: inventoryReport, isLoading: inventoryLoading } = useQuery({
    queryKey: ['inventory-report'],
    queryFn: async () => {
      const response = await api.get('/reports/inventory')
      return response.data
    },
  })

  const { data: financialReport, isLoading: financialLoading } = useQuery({
    queryKey: ['financial-report', startDate, endDate],
    queryFn: async () => {
      const response = await api.get('/reports/financial', {
        params: { startDate, endDate }
      })
      return response.data
    },
  })

  if (salesLoading || inventoryLoading || financialLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Relatórios e análises do sistema</p>
        </div>
      </div>

      {/* Date Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Sales Report */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Relatório de Vendas
            </h3>
            <button 
              onClick={exportSalesReport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesReport && Array.isArray(salesReport) && salesReport.map((order: any) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.partner?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {order.total?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Inventory Report */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Relatório de Estoque
            </h3>
            <button 
              onClick={exportInventoryReport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
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
                    Depósito
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryReport && Array.isArray(inventoryReport) && inventoryReport.map((stock: any) => (
                  <tr key={stock.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stock.product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.warehouse.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.location || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Financial Report */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Relatório Financeiro
            </h3>
            <button 
              onClick={exportFinancialReport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {financialReport && Array.isArray(financialReport) && financialReport.map((item: any) => (
              <div key={`${item.type}-${item.method}`} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.type === 'INBOUND' ? 'Entradas' : 'Saídas'}
                    </p>
                    <p className="text-xs text-gray-500">{item.method}</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  R$ {item._sum?.amount?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-gray-500">
                  {item._count?.id || 0} transações
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

