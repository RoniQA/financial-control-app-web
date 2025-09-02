import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateStockMoveDto } from './dto/create-stock-move.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createStockMove(createStockMoveDto: CreateStockMoveDto) {
    console.log('Creating stock move:', createStockMoveDto);
    
    // Create stock move
    const stockMove = await this.prisma.stockMove.create({
      data: createStockMoveDto,
      include: {
        product: true,
        warehouse: true,
      },
    });

    console.log('Stock move created:', stockMove);

    // Update or create stock record
    const existingStock = await this.prisma.stock.findFirst({
      where: {
        productId: createStockMoveDto.productId,
        warehouseId: createStockMoveDto.warehouseId,
        batch: createStockMoveDto.batch || null,
        serial: createStockMoveDto.serial || null,
      },
    });

    console.log('Existing stock:', existingStock);

    if (existingStock) {
      // Update existing stock
      const newQuantity = createStockMoveDto.type === 'IN' 
        ? existingStock.quantity + createStockMoveDto.quantity
        : existingStock.quantity - createStockMoveDto.quantity;

      console.log('Updating stock. Old:', existingStock.quantity, 'New:', newQuantity);

      await this.prisma.stock.update({
        where: {
          id: existingStock.id,
        },
        data: {
          quantity: Math.max(0, newQuantity), // Ensure quantity doesn't go below 0
        },
      });
    } else {
      // Create new stock record
      const quantity = createStockMoveDto.type === 'IN' 
        ? createStockMoveDto.quantity
        : -createStockMoveDto.quantity;

      console.log('Creating new stock record with quantity:', quantity);

      await this.prisma.stock.create({
        data: {
          productId: createStockMoveDto.productId,
          warehouseId: createStockMoveDto.warehouseId,
          quantity: Math.max(0, quantity),
          reserved: 0,
        },
      });
    }

    return stockMove;
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
    return this.prisma.stock.findMany({
      where: {
        product: {
          companyId,
        },
      },
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
            unit: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
      orderBy: {
        product: {
          name: 'asc',
        },
      },
    });
  }
}

