import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInvoiceDto: CreateInvoiceDto, companyId: string) {
    return this.prisma.invoice.create({
      data: {
        number: createInvoiceDto.number,
        type: createInvoiceDto.type,
        status: createInvoiceDto.status,
        total: createInvoiceDto.total || 0,
        tax: createInvoiceDto.tax || 0,
        dueDate: createInvoiceDto.dueDate ? new Date(createInvoiceDto.dueDate) : null,
        notes: createInvoiceDto.notes,
        companyId: companyId,
        userId: createInvoiceDto.userId,
        partnerId: createInvoiceDto.partnerId,
        orderId: createInvoiceDto.orderId,
      },
      include: {
        partner: true,
        user: true,
        order: true,
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

    return this.prisma.invoice.findMany({
      where,
      include: {
        partner: true,
        user: true,
        order: true,
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
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        partner: true,
        user: true,
        order: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Nota fiscal não encontrada');
    }

    return invoice;
  }

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, companyId: string) {
    await this.findById(id);
    return this.prisma.invoice.update({
      where: { id, companyId },
      data: {
        ...(updateInvoiceDto.number && { number: updateInvoiceDto.number }),
        ...(updateInvoiceDto.type && { type: updateInvoiceDto.type }),
        ...(updateInvoiceDto.status && { status: updateInvoiceDto.status }),
        ...(updateInvoiceDto.total !== undefined && { total: updateInvoiceDto.total }),
        ...(updateInvoiceDto.tax !== undefined && { tax: updateInvoiceDto.tax }),
        ...(updateInvoiceDto.dueDate && { dueDate: new Date(updateInvoiceDto.dueDate) }),
        ...(updateInvoiceDto.notes && { notes: updateInvoiceDto.notes }),
        ...(updateInvoiceDto.partnerId && { partnerId: updateInvoiceDto.partnerId }),
        ...(updateInvoiceDto.orderId && { orderId: updateInvoiceDto.orderId }),
      },
      include: {
        partner: true,
        user: true,
        order: true,
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
    return this.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

