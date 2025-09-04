import { useQuery } from '@tanstack/react-query'
import { warehouseService } from '../services/warehouseService'

export function useDefaultWarehouse() {
  return useQuery({
    queryKey: ['default-warehouse'],
    queryFn: warehouseService.getDefaultWarehouse,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
