import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InventoryService } from '../inventory/inventory.service';
import { FinancialService } from '../financial/financial.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService: InventoryService,
    @Inject(forwardRef(() => FinancialService))
    private readonly financialService: FinancialService,
  ) {}

  async create(createOrderDto: CreateOrderDto, companyId: string) {
    
    return this.prisma.order.create({
      data: {
        number: createOrderDto.number,
        type: createOrderDto.type,
        status: createOrderDto.status,
        total: createOrderDto.total || 0,
        discount: createOrderDto.discount || 0,
        tax: createOrderDto.tax || 0,
        notes: createOrderDto.notes,
        orderDate: createOrderDto.orderDate ? new Date(createOrderDto.orderDate) : new Date(),
        validUntil: createOrderDto.validUntil ? new Date(createOrderDto.validUntil) : null,
        companyId: companyId,
        userId: createOrderDto.userId,
        partnerId: createOrderDto.partnerId,
        items: {
          create: createOrderDto.items?.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            tax: item.tax || 0,
            total: item.total,
            notes: item.notes,
          })) || [],
        },
      },
      include: {
        partner: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findAll(companyId: string, filters?: any) {
    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        partner: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        partner: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, companyId: string) {
    
    const existingOrder = await this.findById(id);
    
    // If items are being updated, handle them separately
    if (updateOrderDto.items) {
      console.log('Deleting existing items and creating new ones')
      // Delete existing items
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id }
      });
    }
    
    const updatedOrder = await this.prisma.order.update({
      where: { id, companyId },
      data: {
        ...(updateOrderDto.number && { number: updateOrderDto.number }),
        ...(updateOrderDto.type && { type: updateOrderDto.type }),
        ...(updateOrderDto.status && { status: updateOrderDto.status }),
        ...(updateOrderDto.total !== undefined && { total: updateOrderDto.total }),
        ...(updateOrderDto.discount !== undefined && { discount: updateOrderDto.discount }),
        ...(updateOrderDto.tax !== undefined && { tax: updateOrderDto.tax }),
        ...(updateOrderDto.notes && { notes: updateOrderDto.notes }),
        ...(updateOrderDto.orderDate && { orderDate: new Date(updateOrderDto.orderDate) }),
        ...(updateOrderDto.validUntil && { validUntil: new Date(updateOrderDto.validUntil) }),
        ...(updateOrderDto.partnerId && { partnerId: updateOrderDto.partnerId }),
        ...(updateOrderDto.items && {
          items: {
            create: updateOrderDto.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              tax: item.tax || 0,
              total: item.total,
              notes: item.notes,
            }))
          }
        }),
      },
      include: {
        partner: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Handle stock updates based on status changes
    if (updateOrderDto.status && updateOrderDto.status !== existingOrder.status) {
      await this.handleStockUpdate(existingOrder, updatedOrder);
    }

    return updatedOrder;
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

      private async handleStockUpdate(existingOrder: any, updatedOrder: any) {
        const { type, status: newStatus, items } = updatedOrder;
        const { status: oldStatus } = existingOrder;

    // Sales order: Update stock when moving to "IN_DELIVERY" or "COMPLETED"
    if (type === 'SALE' && (newStatus === 'IN_DELIVERY' || newStatus === 'COMPLETED')) {
      if (items && items.length > 0) {
        for (const item of items) {
          if (item.productId && item.quantity > 0) {
            try {
              await this.inventoryService.createStockMove({
                productId: item.productId,
                warehouseId: 'cmf1uv2n8000az0axienbav97', // Estoque Principal
                type: 'OUT',
                quantity: item.quantity,
                reason: `Venda - Pedido ${updatedOrder.number}`,
                reference: 'ORDER',
                referenceId: updatedOrder.id,
              });
            } catch (error) {
              console.error(`Error updating stock for product ${item.productId}:`, error);
            }
          }
        }
      }
    }

    // Purchase order: Update stock when status becomes "COMPLETED"
    if (type === 'PURCHASE' && newStatus === 'COMPLETED') {
      if (items && items.length > 0) {
        for (const item of items) {
          if (item.productId && item.quantity > 0) {
            try {
              await this.inventoryService.createStockMove({
                productId: item.productId,
                warehouseId: 'cmf1uv2n8000az0axienbav97', // Estoque Principal
                type: 'IN',
                quantity: item.quantity,
                reason: `Compra - Pedido ${updatedOrder.number}`,
                reference: 'ORDER',
                referenceId: updatedOrder.id,
              });
            } catch (error) {
              console.error(`Error updating stock for product ${item.productId}:`, error);
            }
          }
        }
      }
    }
      // Check if we should create financial notification
      if (newStatus === 'COMPLETED') {
        await this.createFinancialNotification(updatedOrder);
      }
    }

    private async createFinancialNotification(order: any) {
      try {
        // Check if payment already exists for this order
        const existingPayment = await this.prisma.payment.findFirst({
          where: {
            referenceId: order.id,
            companyId: order.companyId,
          },
        });

        if (existingPayment) {
          return;
        }

        // Check if notification already exists
        const existingNotification = await this.prisma.financialNotification.findFirst({
          where: {
            orderId: order.id,
            companyId: order.companyId,
          },
        });

        if (existingNotification) {
          return;
        }

        // Create financial notification record
        const notification = await this.prisma.financialNotification.create({
          data: {
            companyId: order.companyId,
            orderId: order.id,
            type: order.type === 'SALE' ? 'INBOUND' : 'OUTBOUND',
            amount: order.total,
            description: order.type === 'SALE' 
              ? `Venda - Pedido ${order.number}` 
              : `Compra - Pedido ${order.number}`,
            status: 'PENDING',
            partnerId: order.partnerId,
            userId: order.userId,
          },
        });
      } catch (error) {
        console.error('Error creating financial notification:', error);
      }
    }
}

