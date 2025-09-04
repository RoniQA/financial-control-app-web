import api from './api'

export interface Warehouse {
  id: string
  name: string
  code: string
  address?: any
  isActive: boolean
  companyId: string
}

export const warehouseService = {
  getDefaultWarehouse: async (): Promise<Warehouse> => {
    const response = await api.get('/warehouses/default')
    return response.data
  },

  getAllWarehouses: async (): Promise<Warehouse[]> => {
    const response = await api.get('/warehouses')
    return response.data
  }
}
