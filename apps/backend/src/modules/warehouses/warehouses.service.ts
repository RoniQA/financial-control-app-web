import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDefaultWarehouse() {
    // Buscar o primeiro warehouse ativo da empresa
    // Por enquanto, vamos buscar o warehouse com code 'MAIN'
    const warehouse = await this.prisma.warehouse.findFirst({
      where: {
        code: 'MAIN',
        isActive: true,
      },
    });

    if (!warehouse) {
      throw new Error('Warehouse padrão não encontrado');
    }

    return warehouse;
  }

  async getAllWarehouses() {
    // TODO: Implementar busca por companyId do usuário logado
    return this.prisma.warehouse.findMany({
      where: {
        isActive: true,
      },
    });
  }
}
