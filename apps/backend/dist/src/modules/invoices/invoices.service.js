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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let InvoicesService = class InvoicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createInvoiceDto, companyId) {
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
    async findAll(companyId, filters) {
        const where = {
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
    async findById(id) {
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
            throw new common_1.NotFoundException('Nota fiscal não encontrada');
        }
        return invoice;
    }
    async update(id, updateInvoiceDto, companyId) {
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
    async remove(id) {
        await this.findById(id);
        return this.prisma.invoice.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map