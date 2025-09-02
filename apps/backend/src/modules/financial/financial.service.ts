import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class FinancialService {
  constructor(private readonly prisma: PrismaService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: createPaymentDto,
      include: {
        partner: true,
        user: true,
        invoice: true,
        bankAccount: true,
      },
    });
  }

  async findAllPayments(companyId: string, filters?: any) {
    const where: any = {
      companyId,
    };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.method) {
      where.method = filters.method;
    }

    return this.prisma.payment.findMany({
      where,
      include: {
        partner: true,
        user: true,
        invoice: true,
        bankAccount: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        partner: true,
        user: true,
        invoice: true,
        bankAccount: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    return payment;
  }

  async updatePayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.findPaymentById(id);
    return this.prisma.payment.update({
      where: { id },
      data: updatePaymentDto,
      include: {
        partner: true,
        user: true,
        invoice: true,
        bankAccount: true,
      },
    });
  }

  async removePayment(id: string) {
    await this.findPaymentById(id);
    return this.prisma.payment.delete({
      where: { id },
    });
  }

  async getCashFlow(companyId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      companyId,
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.payment.groupBy({
      by: ['type', 'method'],
      where,
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });
  }
}

