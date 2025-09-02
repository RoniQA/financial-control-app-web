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

  async getFinancialNotifications(companyId: string) {
    console.log('🔍 Fetching financial notifications for company:', companyId);
    
    const notifications = await this.prisma.financialNotification.findMany({
      where: {
        companyId,
        status: 'PENDING',
      },
      include: {
        order: {
          include: {
            partner: true,
            user: true,
          },
        },
        partner: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('📊 Found', notifications.length, 'pending notifications');
    return notifications;
  }

  async approveFinancialNotification(notificationId: string, companyId: string) {
    const notification = await this.prisma.financialNotification.findFirst({
      where: {
        id: notificationId,
        companyId,
        status: 'PENDING',
      },
      include: {
        order: true,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notificação financeira não encontrada');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        type: notification.type,
        method: 'CASH', // Default method, can be customized
        amount: notification.amount,
        description: notification.description,
        reference: notification.order.number,
        referenceId: notification.orderId,
        companyId: notification.companyId,
        partnerId: notification.partnerId,
        userId: notification.userId,
        paidAt: new Date(),
      },
    });

    // Update notification status
    await this.prisma.financialNotification.update({
      where: { id: notificationId },
      data: { status: 'APPROVED' },
    });

    return payment;
  }

  async rejectFinancialNotification(notificationId: string, companyId: string) {
    const notification = await this.prisma.financialNotification.findFirst({
      where: {
        id: notificationId,
        companyId,
        status: 'PENDING',
      },
    });

    if (!notification) {
      throw new NotFoundException('Notificação financeira não encontrada');
    }

    return this.prisma.financialNotification.update({
      where: { id: notificationId },
      data: { status: 'REJECTED' },
    });
  }

  async getCompanyBalance(companyId: string) {
    const [inboundResult, outboundResult] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          companyId,
          type: 'INBOUND',
          paidAt: { not: null },
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          companyId,
          type: 'OUTBOUND',
          paidAt: { not: null },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalInbound = inboundResult._sum.amount || 0;
    const totalOutbound = outboundResult._sum.amount || 0;

    return {
      totalInbound,
      totalOutbound,
      balance: totalInbound - totalOutbound,
    };
  }
}

