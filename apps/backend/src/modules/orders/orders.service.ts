import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

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
        validUntil: createOrderDto.validUntil ? new Date(createOrderDto.validUntil) : null,
        companyId: companyId,
        userId: createOrderDto.userId,
        partnerId: createOrderDto.partnerId,
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
    await this.findById(id);
    return this.prisma.order.update({
      where: { id, companyId },
      data: {
        ...(updateOrderDto.number && { number: updateOrderDto.number }),
        ...(updateOrderDto.type && { type: updateOrderDto.type }),
        ...(updateOrderDto.status && { status: updateOrderDto.status }),
        ...(updateOrderDto.total !== undefined && { total: updateOrderDto.total }),
        ...(updateOrderDto.discount !== undefined && { discount: updateOrderDto.discount }),
        ...(updateOrderDto.tax !== undefined && { tax: updateOrderDto.tax }),
        ...(updateOrderDto.notes && { notes: updateOrderDto.notes }),
        ...(updateOrderDto.validUntil && { validUntil: new Date(updateOrderDto.validUntil) }),
        ...(updateOrderDto.partnerId && { partnerId: updateOrderDto.partnerId }),
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

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

