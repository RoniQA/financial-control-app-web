import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDefaultWarehouse(companyId: string) {
    // Buscar o primeiro warehouse ativo da empresa
    // Por enquanto, vamos buscar o warehouse com code 'MAIN'
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        companyId,
        code: 'MAIN',
        isActive: true,
      },
    });

    if (!warehouse) {
      throw new Error('Warehouse padrão não encontrado');
    }

    return warehouse;
  }

  async getAllWarehouses(companyId: string) {
    return this.prisma.warehouse.findMany({
      where: {
        companyId,
        isActive: true,
      },
    });
  }
}
