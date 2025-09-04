import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import api from '../services/api'
import { PartnerFormModal } from '../components/PartnerFormModal'
import { toast } from 'react-hot-toast'

export function PartnersPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null)
  const queryClient = useQueryClient()

  const { data: partners, isLoading } = useQuery({
    queryKey: ['partners', search, typeFilter],
    queryFn: async () => {
      const response = await api.get('/partners', {
        params: { search, type: typeFilter }
      })
      return response.data
    },
  })

  const handleCreatePartner = () => {
    setEditingPartner(null)
    setIsModalOpen(true)
  }

  const handleEditPartner = (partner: any) => {
    setEditingPartner(partner)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingPartner(null)
  }

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['partners'] })
    queryClient.invalidateQueries({ queryKey: ['orders'] })
    queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
  }

  const handleDeletePartner = async (partner: any) => {
    if (window.confirm(`Tem certeza que deseja deletar o parceiro "${partner.name}"?`)) {
      try {
        await api.delete(`/partners/${partner.id}`)
        toast.success('Parceiro deletado com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['partners'] })
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: ['reports-dashboard'] })
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Erro ao deletar parceiro')
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
          <h1 className="text-2xl font-bold text-gray-900">Parceiros</h1>
          <p className="text-gray-600">Gerencie clientes e fornecedores</p>
        </div>
        <button 
          onClick={handleCreatePartner}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Parceiro
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar parceiros..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="CUSTOMER">Clientes</option>
            <option value="SUPPLIER">Fornecedores</option>
            <option value="BOTH">Ambos</option>
          </select>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
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
              {partners && Array.isArray(partners) && partners.map((partner: any) => (
                <tr key={partner.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {partner.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.document}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      partner.type === 'CUSTOMER' 
                        ? 'bg-blue-100 text-blue-800'
                        : partner.type === 'SUPPLIER'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {partner.type === 'CUSTOMER' ? 'Cliente' : 
                       partner.type === 'SUPPLIER' ? 'Fornecedor' : 'Ambos'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {partner.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      partner.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {partner.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditPartner(partner)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeletePartner(partner)}
                        className="text-red-600 hover:text-red-900"
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

      {partners?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum parceiro encontrado</p>
        </div>
      )}

      {/* Modal */}
      <PartnerFormModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        partner={editingPartner}
      />
    </div>
  )
}

