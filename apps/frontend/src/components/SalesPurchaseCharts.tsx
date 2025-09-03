import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react'
import api from '../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface ChartData {
  labels: string[]
  salesData: number[]
  purchaseData: number[]
}

export function SalesPurchaseCharts() {
  const [period, setPeriod] = useState('30') // 7, 30, 90, 365 days
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  // Calculate date range based on period
  const getDateRange = (days: number) => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  }

  const { startDate, endDate } = getDateRange(parseInt(period))

  // Fetch sales data
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-report', startDate, endDate],
    queryFn: () => api.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`).then(res => res.data),
  })

  // Fetch purchases data
  const { data: purchasesData, isLoading: purchasesLoading } = useQuery({
    queryKey: ['purchases-report', startDate, endDate],
    queryFn: () => api.get(`/reports/purchases?startDate=${startDate}&endDate=${endDate}`).then(res => res.data),
  })



  // Process data for charts
  const processChartData = (): ChartData => {
    const labels: string[] = []
    const salesDataArray: number[] = []
    const purchaseDataArray: number[] = []

    // Group data by day
    const salesByDay: { [key: string]: number } = {}
    const purchasesByDay: { [key: string]: number } = {}

    // Process sales data
    salesData?.forEach((order: any) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0]
      salesByDay[date] = (salesByDay[date] || 0) + (order.total || 0)
    })

    // Process purchases data
    purchasesData?.forEach((order: any) => {
      const date = new Date(order.createdAt).toISOString().split('T')[0]
      purchasesByDay[date] = (purchasesByDay[date] || 0) + (order.total || 0)
    })

    // Create date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0]
      labels.push(d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }))
      salesDataArray.push(salesByDay[dateStr] || 0)
      purchaseDataArray.push(purchasesByDay[dateStr] || 0)
    }

    return { labels, salesData: salesDataArray, purchaseData: purchaseDataArray }
  }

  const chartData = processChartData()

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value.toLocaleString('pt-BR')
          }
        }
      }
    },
    tooltips: {
      callbacks: {
        label: function(context: any) {
          return 'R$ ' + context.parsed.y.toLocaleString('pt-BR')
        }
      }
    }
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Vendas',
        data: chartData.salesData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Compras',
        data: chartData.purchaseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  }

  const totalSales = chartData.salesData.reduce((sum, value) => sum + value, 0)
  const totalPurchases = chartData.purchaseData.reduce((sum, value) => sum + value, 0)
  const netResult = totalSales - totalPurchases

  if (salesLoading || purchasesLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Vendas vs Compras</h2>
          <div className="flex items-center space-x-4">
            {/* Period Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>

            {/* Chart Type Filter */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm rounded-md ${
                  chartType === 'line'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Linha
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm rounded-md ${
                  chartType === 'bar'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Barras
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Total Vendas</p>
                <p className="text-lg font-bold text-green-900">
                  R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-600">Total Compras</p>
                <p className="text-lg font-bold text-red-900">
                  R$ {totalPurchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${netResult >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
            <div className="flex items-center">
              {netResult >= 0 ? (
                <TrendingUp className="h-5 w-5 text-blue-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-orange-600" />
              )}
              <div className="ml-3">
                <p className={`text-sm font-medium ${netResult >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Resultado Líquido
                </p>
                <p className={`text-lg font-bold ${netResult >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  R$ {netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96">
          {chartType === 'line' ? (
            <Line options={options} data={data} />
          ) : (
            <Bar options={options} data={data} />
          )}
        </div>
      </div>
    </div>
  )
}
