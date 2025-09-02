import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStockMoveDto } from './dto/create-stock-move.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createStockMove(createStockMoveDto: CreateStockMoveDto) {
    return this.prisma.stockMove.create({
      data: createStockMoveDto,
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  async getStockMoves(productId?: string, warehouseId?: string) {
    const where: any = {};
    
    if (productId) where.productId = productId;
    if (warehouseId) where.warehouseId = warehouseId;

    return this.prisma.stockMove.findMany({
      where,
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStockSummary(companyId: string) {
    return this.prisma.stock.groupBy({
      by: ['productId'],
      where: {
        product: {
          companyId,
        },
      },
      _sum: {
        quantity: true,
        reserved: true,
      },
    });
  }
}

