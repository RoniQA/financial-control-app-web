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
    if (salesData && Array.isArray(salesData)) {
      salesData.forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0]
        salesByDay[date] = (salesByDay[date] || 0) + (order.total || 0)
      })
    }

    // Process purchases data
    if (purchasesData && Array.isArray(purchasesData)) {
      purchasesData.forEach((order: any) => {
        const date = new Date(order.createdAt).toISOString().split('T')[0]
        purchasesByDay[date] = (purchasesByDay[date] || 0) + (order.total || 0)
      })
    }

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

  const totalSales = (chartData.salesData && Array.isArray(chartData.salesData) ? chartData.salesData : []).reduce((sum, value) => sum + value, 0)
  const totalPurchases = (chartData.purchaseData && Array.isArray(chartData.purchaseData) ? chartData.purchaseData : []).reduce((sum, value) => sum + value, 0)
  const netResult = totalSales - totalPurchases

  if (salesLoading || purchasesLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-secondary-600 font-medium">Carregando gráficos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900">Vendas vs Compras</h2>
          </div>
          <div className="flex items-center space-x-4">
            {/* Period Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-secondary-500" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm border border-white/20 rounded-xl px-3 py-2 bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>

            {/* Chart Type Filter */}
            <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setChartType('line')}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  chartType === 'line'
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-white/80'
                }`}
              >
                Linha
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                  chartType === 'bar'
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'text-secondary-600 hover:text-primary-600 hover:bg-white/80'
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-gradient-to-r from-success-50 to-success-100/50 rounded-2xl p-6 border border-success-200 hover:shadow-glow-success transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-success-600">Total Vendas</p>
                <p className="text-2xl font-bold text-success-900">
                  R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-r from-danger-50 to-danger-100/50 rounded-2xl p-6 border border-danger-200 hover:shadow-glow-danger transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-danger-100 rounded-xl">
                <TrendingDown className="h-6 w-6 text-danger-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-danger-600">Total Compras</p>
                <p className="text-2xl font-bold text-danger-900">
                  R$ {totalPurchases.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className={`group rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
            netResult >= 0 
              ? 'bg-gradient-to-r from-primary-50 to-primary-100/50 border-primary-200 hover:shadow-glow' 
              : 'bg-gradient-to-r from-warning-50 to-warning-100/50 border-warning-200 hover:shadow-glow-warning'
          }`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-xl ${
                netResult >= 0 ? 'bg-primary-100' : 'bg-warning-100'
              }`}>
                {netResult >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-warning-600" />
                )}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${netResult >= 0 ? 'text-primary-600' : 'text-warning-600'}`}>
                  Resultado Líquido
                </p>
                <p className={`text-2xl font-bold ${netResult >= 0 ? 'text-primary-900' : 'text-warning-900'}`}>
                  R$ {netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="h-96">
            {chartType === 'line' ? (
              <Line options={options} data={data} />
            ) : (
              <Bar options={options} data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
