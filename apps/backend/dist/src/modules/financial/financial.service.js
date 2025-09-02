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
exports.FinancialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let FinancialService = class FinancialService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPayment(createPaymentDto) {
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
    async findAllPayments(companyId, filters) {
        const where = {
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
    async findPaymentById(id) {
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
            throw new common_1.NotFoundException('Pagamento não encontrado');
        }
        return payment;
    }
    async updatePayment(id, updatePaymentDto) {
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
    async removePayment(id) {
        await this.findPaymentById(id);
        return this.prisma.payment.delete({
            where: { id },
        });
    }
    async getCashFlow(companyId, startDate, endDate) {
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
};
exports.FinancialService = FinancialService;
exports.FinancialService = FinancialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialService);
//# sourceMappingURL=financial.service.js.map