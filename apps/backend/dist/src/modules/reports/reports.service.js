"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSalesReport(companyId, startDate, endDate) {
        const where = {
            companyId,
            type: 'SALE',
            status: 'COMPLETED',
        };
        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate,
            };
        }
        return this.prisma.order.findMany({
            where,
            include: {
                partner: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getInventoryReport(companyId) {
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
    async getFinancialReport(companyId, startDate, endDate) {
        const where = {
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
    async getDashboardData(companyId) {
        const [totalProducts, totalPartners, totalOrders, totalInvoices, recentOrders, lowStockProducts,] = await Promise.all([
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
                        lte: 10,
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map