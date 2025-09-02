import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSalesReport(companyId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      companyId,
      type: 'SALE',
      // Removed status filter to include all sales orders
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const result = await this.prisma.order.findMany({
      where,
      select: {
        id: true,
        number: true,
        type: true,
        total: true,
        createdAt: true,
        partner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return result;
  }

  async getInventoryReport(companyId: string) {
    return this.prisma.stock.findMany({
      where: {
        product: {
          companyId,
        },
      },
      include: {
        product: true,
        warehouse: true,
      },
      orderBy: {
        product: {
          name: 'asc',
        },
      },
    });
  }

  async getPurchaseReport(companyId: string, startDate?: Date, endDate?: Date) {
    const where: any = {
      companyId,
      type: 'PURCHASE',
      // Removed status filter to include all purchase orders
    };

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const result = await this.prisma.order.findMany({
      where,
      select: {
        id: true,
        number: true,
        type: true,
        total: true,
        createdAt: true,
        partner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return result;
  }

  async getFinancialReport(companyId: string, startDate?: Date, endDate?: Date) {
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

  async getDashboardData(companyId: string) {
    const [
      totalProducts,
      totalPartners,
      totalOrders,
      totalInvoices,
      recentOrders,
      lowStockProducts,
    ] = await Promise.all([
      this.prisma.product.count({
        where: { companyId, deletedAt: null },
      }),
      this.prisma.partner.count({
        where: { companyId, deletedAt: null },
      }),
      this.prisma.order.count({
        where: { companyId, deletedAt: null },
      }),
      this.prisma.invoice.count({
        where: { companyId, deletedAt: null },
      }),
      this.prisma.order.findMany({
        where: { companyId, deletedAt: null },
        include: {
          partner: true,
          user: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.stock.findMany({
        where: {
          product: {
            companyId,
            deletedAt: null,
          },
          quantity: {
            lte: 10, // Low stock threshold
          },
        },
        include: {
          product: true,
          warehouse: true,
        },
        take: 10,
      }),
    ]);

    return {
      totals: {
        products: totalProducts,
        partners: totalPartners,
        orders: totalOrders,
        invoices: totalInvoices,
      },
      recentOrders,
      lowStockProducts,
    };
  }
}

